const { v4: uuidv4 } = require('uuid');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

const MAX_FILE_SIZE = 1000000; // 1MB (1000000 bytes)

const predict = async (request, h) => {
    try {
        // Cek apakah file gambar ada
        if (!request.payload.image) {
            return h.response({
                status: 'fail',
                message: 'Tidak ada file gambar yang dikirim'
            }).code(400);
        }

        // Cek ukuran file
        const fileSize = request.payload.image.bytes;
        if (fileSize > MAX_FILE_SIZE) {
            return h.response({
                status: 'fail',
                message: `Payload content length greater than maximum allowed: ${MAX_FILE_SIZE}`
            }).code(413);
        }

        // Proses gambar dan prediksi
        const filePath = path.join(__dirname, 'uploads', uuidv4() + '.jpg');
        const fileStream = fs.createWriteStream(filePath);
        request.payload.image.pipe(fileStream);

        await new Promise((resolve, reject) => {
            fileStream.on('finish', resolve);
            fileStream.on('error', reject);
        });

        const imageTensor = await tf.node.decodeImage(fs.readFileSync(filePath));
        const result = await predictWithModel(imageTensor); // Prediksi gambar

        const resultClass = result > 0.5 ? 'Cancer' : 'Non-cancer';
        const suggestion = resultClass === 'Cancer' ? 'Segera periksa ke dokter!' : 'Penyakit kanker tidak terdeteksi.';

        return h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data: {
                id: uuidv4(),
                result: resultClass,
                suggestion: suggestion,
                createdAt: new Date().toISOString(),
            }
        });
    } catch (error) {
        console.error(error);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi'
        }).code(400);
    }
};

// Fungsi untuk memprediksi hasil dengan model ML (contoh sederhana, ganti dengan model asli)
const predictWithModel = async (imageTensor) => {
    // Di sini, Anda akan memuat model ML dan melakukan inferensi
    // Contoh prediksi acak untuk demo
    const randomValue = Math.random();  // Gantikan ini dengan prediksi model ML yang sesungguhnya
    return randomValue;
};

module.exports = {
    predict
};
