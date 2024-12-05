const express = require("express");
const multer = require("multer");
const app = express();
const port = 8080;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 1000000 } });

app.post("/predict", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ status: "fail", message: "No file uploaded" });
  }

  // Implement logic untuk memanggil model ML dan prediksi
  // Misal, memanggil model yang ada di Cloud Storage

  const prediction = {
    status: "success",
    message: "Model is predicted successfully",
    data: {
      id: "77bd90fc-c126-4ceb-828d-f048dddff746",
      result: "Cancer", // Atau 'Non-cancer'
      suggestion: "Segera periksa ke dokter!", // Atau pesan lainnya
      createdAt: new Date().toISOString(),
    },
  };

  res.status(200).json(prediction);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
