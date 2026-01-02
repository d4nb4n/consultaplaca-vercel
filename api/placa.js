import fetch from "node-fetch";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const { id } = req.query;
  const url = `https://puxaplaca.com.br/placa/${id}`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" } // ajuda a evitar bloqueio
    });
    const html = await response.text();

    // 🔎 Loga o HTML recebido nos Runtime Logs do Vercel
    console.log("HTML recebido:", html.substring(0, 500)); 
    // mostra só os primeiros 500 caracteres para não lotar os logs

    const $ = cheerio.load(html);

    const dados = {
      placa: id,
      marca: $("td:contains('Marca')").next().text().trim(),
      modelo: $("td:contains('Modelo')").next().text().trim(),
      ano: $("td:contains('Ano')").next().text().trim(),
      anoModelo: $("td:contains('Ano Modelo')").next().text().trim(),
      cor: $("td:contains('Cor')").next().text().trim(),
      municipio: $("td:contains('Município')").next().text().trim(),
      uf: $("td:contains('UF')").next().text().trim(),
      chassi: $("td:contains('Chassi')").next().text().trim(),
      fipe: [],
      ipva: []
    };

    $("table:contains('FIPE') tr").each((i, el) => {
      const cols = $(el).find("td");
      if (cols.length > 1) {
        dados.fipe.push({
          codigo: $(cols[0]).text().trim(),
          valor: $(cols[1]).text().trim()
        });
      }
    });

    $("table:contains('IPVA') tr").each((i, el) => {
      const cols = $(el).find("td");
      if (cols.length > 1) {
        dados.ipva.push({
          estado: $(cols[0]).text().trim(),
          valor: $(cols[1]).text().trim()
        });
      }
    });

    res.status(200).json(dados);
  } catch (err) {
    console.error("Erro ao consultar:", err);
    res.status(500).json({ erro: "Falha ao consultar placa" });
  }
}
