require('dotenv').config();
const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configurações
const STORE_API_URL = process.env.STORE_API_URL || 'http://localhost:3000/api/orders/pending';
const POLL_INTERVAL = 300000; // 5 minutos

console.log("🤖 Agente Comprador Iniciado (Versão V5 - Market Master)!");
console.log(`📡 Monitorando API: ${STORE_API_URL}`);

async function startAgent() {
    // Modo População: Caçador de Ofertas
    if (process.argv.includes('--populate')) {
        console.log("🚀 MODO CAÇADOR DE OFERTAS ATIVADO");
        await populateCatalog();
        return;
    }

    // Modo Monitoramento de Pedidos
    while (true) {
        try {
            await checkPendingOrders();
        } catch (error) {
            console.error("❌ Erro no ciclo de verificação:", error.message);
        }
        await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
    }
}

async function populateCatalog() {
    try {
        console.log("🔥 Iniciando Caça às Ofertas Fitness...");

        // FORÇANDO CATEGORIAS SOLICITADAS (Musculação, Suplementos, Moda, Tech, Garrafas)
        const selectedKeywords = [
            { term: "kit halteres", cat: "equipment" },
            { term: "whey protein", cat: "supplements" },
            { term: "camiseta dry fit masculina", cat: "apparel" },
            { term: "smartwatch", cat: "tech" },
            { term: "garrafa térmica academia", cat: "equipment" },
            { term: "legging feminina fitness", cat: "apparel" },
            { term: "top fitness", cat: "apparel" }, // Extra moda
            { term: "creatina", cat: "supplements" }, // Extra suplemento
            { term: "fone de ouvido bluetooth", cat: "tech" } // Extra tech
        ];

        console.log(`📋 Buscando ofertas para: ${selectedKeywords.map(k => k.term).join(', ')}`);

        for (const item of selectedKeywords) {
            const fakeOrder = {
                orderNumber: `DEAL-${Date.now()}`,
                items: [{ title: item.term, category: item.cat }],
                isDealHunt: true
            };

            await processOrder(fakeOrder);

            console.log("☕ Pausa para evitar bloqueio...");
            await new Promise(r => setTimeout(r, 5000));
        }
        console.log("✅ Caça às ofertas concluída!");
    } catch (e) {
        console.error("Erro na população:", e);
    }
}

async function checkPendingOrders() {
    console.log("🔍 Buscando pedidos pendentes...");
    try {
        const response = await axios.get(STORE_API_URL);
        if (response.data && response.data.orders && response.data.orders.length > 0) {
            const orders = response.data.orders;
            console.log(`📦 Encontrados ${orders.length} pedidos pendentes!`);
            for (const order of orders) {
                await processOrder(order);
            }
        } else {
            console.log("zzz... Sem novos pedidos.");
        }
    } catch (error) {
        if (error.code !== 'ECONNREFUSED') console.error("⚠️ Erro ao conectar na loja:", error.message);
    }
}

async function processOrder(order) {
    console.log(`🚀 Processando Pedido #${order.orderNumber}...`);
    let browser;
    try {
        // Conexão ao Chrome Debug
        try {
            browser = await puppeteer.connect({
                browserURL: 'http://localhost:9222',
                defaultViewport: null
            });
            console.log("✅ Conectado ao Chrome!");
        } catch (e) {
            console.log("⚠️ Chrome fechado. Tentando abrir...");
            const { exec } = require('child_process');
            exec('start "" "iniciar_chrome_bot.bat"', { cwd: __dirname });
            await new Promise(r => setTimeout(r, 8000));
            browser = await puppeteer.connect({ browserURL: 'http://localhost:9222', defaultViewport: null });
        }

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        // Carregar Cookies
        try {
            if (fs.existsSync('./cookies.json')) {
                const cookies = JSON.parse(fs.readFileSync('./cookies.json', 'utf8'));
                if (cookies.length) await page.setCookie(...cookies);
            }
        } catch (e) { }

        // Ir para Amazon
        await page.goto('https://www.amazon.com.br/', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 2000));

        // Busca
        const productName = order.items[0].title;
        const searchInput = await page.$('#twotabsearchtextbox');

        if (searchInput) {
            // Se for Deal Hunt, adiciona "oferta" na busca
            const searchTerm = order.isDealHunt ? `${productName} oferta` : productName;
            console.log(`🔎 Termo de busca: "${searchTerm}"`);

            await page.evaluate(() => document.querySelector('#twotabsearchtextbox').value = '');
            await page.type('#twotabsearchtextbox', searchTerm);
            await page.keyboard.press('Enter');
            await page.waitForNavigation();

            if (order.isDealHunt) {
                console.log("🏹 Modo Deal Hunter: Buscando múltiplos produtos...");

                const productLinks = await page.evaluate(() => {
                    const links = [];
                    const selectors = [
                        '[data-component-type="s-search-result"] h2 a',
                        '.s-result-item h2 a',
                        '.a-section .a-link-normal.s-no-outline',
                        '#search .s-lockup-content h2 a'
                    ];

                    for (const sel of selectors) {
                        const items = document.querySelectorAll(sel);
                        items.forEach(a => {
                            if (links.length < 5 && a.href && a.href.includes('/dp/') && !links.includes(a.href)) {
                                links.push(a.href);
                            }
                        });
                        if (links.length >= 3) break;
                    }
                    return links;
                });

                console.log(`🎯 ${productLinks.length} produtos encontrados.`);

                for (const link of productLinks) {
                    try {
                        console.log(`➳ Visitando: ${link}`);
                        await page.goto(link, { waitUntil: 'domcontentloaded' });

                        try { await page.waitForSelector('#productTitle', { timeout: 8000 }); }
                        catch (e) { console.log("⚠️ Timeout loading product."); continue; }

                        // Extração com Categoria
                        const productData = await scrapeProductData(page, order.items[0].category || "fitness");

                        // --- LÓGICA DE PRECIFICAÇÃO E MARKUP ---
                        const basePrice = productData.price;
                        if (basePrice > 0) {
                            productData.costPrice = basePrice; // Guarda custo
                            // Markup de 40%
                            productData.price = parseFloat((basePrice * 1.4).toFixed(2));

                            // Separação: Oferta vs Lançamento (30% de chance de ser oferta)
                            const isFlashDeal = Math.random() < 0.3;

                            if (isFlashDeal || productName.toLowerCase().includes('oferta')) {
                                // Oferta Relâmpago: Preço 'De' fictício (+60% do custo)
                                productData.originalPrice = parseFloat((basePrice * 1.6).toFixed(2));
                                const now = new Date();
                                const tomorrow = new Date(now);
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                productData.expiresAt = tomorrow.toISOString();
                                productData.isDeal = true;
                            } else {
                                // Lançamento Comum
                                productData.expiresAt = null;
                                productData.isDeal = false;
                                productData.originalPrice = null; // Sem "De/Por" agressivo
                            }
                        }

                        productData.createdAt = new Date().toISOString();

                        saveProduct(productData);
                        await new Promise(r => setTimeout(r, 2000));
                    } catch (err) {
                        console.error("Erro item:", err.message);
                    }
                }
            } else {
                // Modo Pedido Único
                try {
                    const resultSelector = '.s-main-slot .s-result-item[data-component-type="s-search-result"] h2 a';
                    await page.waitForSelector(resultSelector, { timeout: 5000 });
                    await page.click(resultSelector);
                    await page.waitForSelector('#productTitle', { timeout: 15000 });
                    const productData = await scrapeProductData(page, order.items[0].category || "fitness");
                    saveProduct(productData);
                } catch (e) { console.error("Erro busca simples:", e); }
            }
        }

    } catch (error) {
        console.error(`❌ Erro no pedido ${order.orderNumber}:`, error.message);
    } finally {
        console.log("⏳ Fechando aba em 2s...");
        await new Promise(r => setTimeout(r, 2000));
        if (browser) await browser.close();
    }
}

async function scrapeProductData(page, targetCategory) {
    return await page.evaluate((targetCat) => {
        const data = {};
        const getTxt = (sel) => document.querySelector(sel)?.innerText.trim() || "";

        data.name = getTxt('#productTitle')
            .replace(/\[.*?\]/g, '').replace(/\(.*?\)$/g, '').trim();

        const priceSelectors = [
            '.a-price .a-offscreen',
            '#price_inside_buybox',
            '#corePrice_feature_div .a-offscreen',
            '#corePriceDisplay_desktop_feature_div .a-offscreen',
            '.apexPriceToPay .a-offscreen',
            '#priceblock_ourprice',
            '#priceblock_dealprice'
        ];

        let priceEl = null;
        for (const sel of priceSelectors) {
            priceEl = document.querySelector(sel);
            if (priceEl && priceEl.innerText.trim() !== '') break;
        }

        data.price = priceEl ? parseFloat(priceEl.innerText.replace(/[^0-9,.]/g, '').replace(',', '.')) : 0;

        // Imagens
        data.images = [];
        const altImages = document.querySelectorAll('#altImages ul li img');
        if (altImages.length) {
            altImages.forEach(img => {
                let src = img.src;
                // Filtro aprimorado para ignorar ícones 360, miniaturas genéricas e imagens de play
                if (src && !src.includes('play-icon') && !src.includes('video') && !src.includes('360_icon') && !src.includes('73x73')) {
                    const hd = src.replace(/\._.*?_\./, '.');
                    if (!data.images.includes(hd)) data.images.push(hd);
                }
            });
        }
        if (!data.images.length) {
            const main = document.querySelector('#landingImage');
            if (main) {
                const mainSrc = main.src;
                if (!mainSrc.includes('360_icon')) {
                    data.images.push(mainSrc.replace(/\._.*?_\./, '.'));
                }
            }
        }

        // Descrição
        const bullets = document.querySelectorAll('#feature-bullets li span.a-list-item');
        data.description = bullets.length ?
            Array.from(bullets).slice(0, 5).map(e => e.innerText.trim()).join('\n\n') :
            getTxt('#productDescription');

        data.category = targetCat; // Usa categoria passada pelo agente

        // Vídeo
        const vid = document.querySelector('video') || document.querySelector('.vjs-tech');
        if (vid && vid.src) data.video = vid.src;

        // Reviews
        const rImgs = [];
        document.querySelectorAll('.review-image-tile').forEach(i => {
            if (i.src) rImgs.push(i.src.replace(/\._.*?_\./, '.'));
        });
        data.scrapedReviewImages = [...new Set(rImgs)].slice(0, 6);

        // Variants
        data.variants = [];
        // Seletores mais robustos para Amazon Brasil
        const swatchItems = document.querySelectorAll('.swatchAvailable, .swatchSelect, #variation_color_name li, #variation_style_name li, #variation_size_name li');

        swatchItems.forEach(li => {
            const img = li.querySelector('img');
            const swatchPriceEl = li.querySelector('.twisterSwatchPrice, .a-color-price, .swatchPrice');
            const nameEl = li.querySelector('.swatchText, .a-size-small');

            if (img && img.src) {
                const variantName = img.alt || nameEl?.innerText.trim() || "Modelo";
                const rawPrice = swatchPriceEl?.innerText.trim();
                const variantPrice = rawPrice ? parseFloat(rawPrice.replace(/[^0-9,.]/g, '').replace(',', '.')) : null;

                data.variants.push({
                    name: variantName,
                    image: img.src.replace(/\._AC_.*?_\./, '.').replace(/\._SS.*?_\./, '.'),
                    price: variantPrice
                });
            }
        });

        return data;
    }, targetCategory);
}

async function saveProduct(productData) {
    if (!productData.price || productData.price <= 0) {
        console.log(`⚠️ Produto ignorado (Preço inválido/Zero): ${productData.name}`);
        return;
    }

    const finalProduct = {
        id: productData.id || `offer-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: productData.name,
        price: productData.price,
        costPrice: productData.costPrice,
        originalPrice: productData.originalPrice,
        description: productData.description,
        images: productData.images,
        category: productData.category,
        variants: productData.variants?.map(v => ({
            ...v,
            price: v.price ? parseFloat((v.price * 1.4).toFixed(2)) : null
        })),
        video: productData.video,
        expiresAt: productData.expiresAt,
        createdAt: productData.createdAt,
        salesCount: Math.floor(Math.random() * 2000) + 100
    };

    try {
        const API_URL = process.env.NEXT_PUBLIC_SITE_URL ?
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/upsert` :
            'http://localhost:3000/api/products/upsert';

        await axios.post(API_URL, finalProduct);
        console.log(`✨ Oferta Sincronizada no Banco: ${finalProduct.name}`);
    } catch (error) {
        console.error(`❌ Erve ao sincronizar produto: ${error.message}`);
        // Fallback para log local se API falhar
        fs.appendFileSync('sync_errors.log', `${new Date().toISOString()} - ${error.message}\n`);
    }
}

startAgent();
