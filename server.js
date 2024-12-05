const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 8080; // Port aplikasi

// Middleware
app.use(bodyParser.json());

// Konfigurasi multer untuk upload file
const upload = multer({
  limits: { fileSize: 1000000 }, // Maksimal ukuran 1MB
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("File harus berupa gambar (jpg, jpeg, png)"));
    }
    cb(null, true);
  },
});

// Endpoint /predict
app.post("/predict", upload.single("image"), (req, res) => {
  try {
    // Validasi jika tidak ada file
    if (!req.file) {
      return res.status(400).send({
        status: "fail",
        message: "File gambar tidak ditemukan",
      });
    }

    const fileSize = req.file.size;

    // Simulasi prediksi
    const prediction = Math.random() > 0.5 ? "Cancer" : "Non-cancer";
    const suggestion =
      prediction === "Cancer"
        ? "Segera periksa ke dokter!"
        : "Penyakit kanker tidak terdeteksi.";

    // Response sukses
    const response = {
      status: "success",
      message: "Model is predicted successfully",
      data: {
        id: uuidv4(),
        result: prediction,
        suggestion: suggestion,
        createdAt: new Date().toISOString(),
      },
    };

    res.send(response);
  } catch (err) {
    if (err.message === "File harus berupa gambar (jpg, jpeg, png)") {
      return res.status(400).send({
        status: "fail",
        message: err.message,
      });
    }

    res.status(500).send({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    });
  }
});

// Error handler untuk file lebih dari 1MB
app.use((err, req, res, next) => {
  if (err.message.includes("File too large")) {
    return res.status(413).send({
      status: "fail",
      message: "Payload content length greater than maximum allowed: 1000000",
    });
  }
  next(err);
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
