export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ erro: "Placa obrigatória" });

  const url = `https://puxaplaca.com.br/placa/${id}`;

  try {
    const response = await fetch(url);
    const html = await response.text();

    console.log("API /placa simples chamada:", id);

    res.status(200).json({ placa: id.toUpperCase(), html });
  } catch (err) {
    console.error("Falha ao acessar site diretamente:", err);
    res.status(500).json({ erro: "Falha ao acessar site diretamente" });
  }
}
