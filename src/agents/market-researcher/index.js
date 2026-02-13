require('dotenv').config();
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Configurações
const SEARCH_TERM = "tenis corrida masculino barato";
const PRODUCTS_DB_PATH = path.join(__dirname, '../../data/products.json');

async function scrapeAndSave() {
    console.log(`🕵️‍♂️ Sniper Iniciado! Buscando: "${SEARCH_TERM}"`);

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
    });

    const page = await browser.newPage();

    // Otimização e Disfarce
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (['font'].includes(req.resourceType())) { // Imagens são necessárias para pegar a URL da foto!
            req.abort();
        } else {
            req.continue();
        }
    });

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        // 1. Ir para Busca da Amazon
        const searchUrl = `https://www.amazon.com.br/s?k=${encodeURIComponent(SEARCH_TERM)}&s=price-asc-rank`;
        console.log(`🚀 Acessando busca: ${searchUrl}`);
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // 2. Pegar o primeiro resultado orgânico
        const content = await page.content();
        const $ = cheerio.load(content);

        // Seletores (tentativa de pegar o primeiro item da lista de resultados)
        const firstResult = $('div[data-component-type="s-search-result"]').first();

        if (firstResult.length > 0) {
            const title = firstResult.find('h2 span').text().trim();
            const priceWhole = firstResult.find('.a-price-whole').first().text().trim();
            const priceFraction = firstResult.find('.a-price-fraction').first().text().trim();
            const image = firstResult.find('img.s-image').attr('src');
            const link = "https://www.amazon.com.br" + firstResult.find('h2 a').attr('href');

            // Formata Preço
            let price = 0;
            if (priceWhole) {
                const cleanPrice = (priceWhole + (priceFraction ? ',' + priceFraction : '')).replace('.', '').replace(',', '.');
                price = parseFloat(cleanPrice);
            }

            console.log("---------------------------------------------------");
            console.log(`📦 Encontrado: ${title}`);
            console.log(`💰 Preço: R$ ${price}`);
            console.log(`📸 Imagem: ${image}`);
            console.log("---------------------------------------------------");

            if (title && price > 0) {
                // 3. Salvar no JSON da Loja
                const currentProducts = JSON.parse(fs.readFileSync(PRODUCTS_DB_PATH, 'utf8'));

                const newProduct = {
                    id: `auto-${Date.now()}`, // ID único
                    name: title.substring(0, 50) + "...", // Encurta título
                    price: price,
                    image: image
                };

                // Adiciona no começo da lista
                currentProducts.unshift(newProduct);

                // Mantém apenas os top 8 para não poluir
                if (currentProducts.length > 8) currentProducts.pop();

                fs.writeFileSync(PRODUCTS_DB_PATH, JSON.stringify(currentProducts, null, 2));
                console.log("✅ PRODUTO ADICIONADO À LOJA COM SUCESSO!");
            }

        } else {
            console.log("⚠️ Nenhum produto encontrado na busca.");
        }

    } catch (error) {
        console.error("❌ Erro no Sniper:", error.message);
    } finally {
        await browser.close();
        console.log("👋 Sniper desconectado.");
    }
}

scrapeAndSave();
