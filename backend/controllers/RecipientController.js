const Recipient = require("../models/RecipientModel.js");
//const JadwalUjian = require("../models/JadwalModel.js");
const {Sequelize} = require("sequelize");
const xlsx = require("xlsx");
const path = require('path');


const getRecipient = async(req, res) =>{
    try {
        const response = await Recipient.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

const getRecipientById = async(req, res) =>{
    try {
        const response = await Recipient.findOne({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

const createBulkRecipient = async(req, res) =>{
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ error: 'No Excel file uploaded.' });
      }
      // Read the Excel file using xlsx
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

    // Assuming your Excel file has a single worksheet, use the first one
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert the worksheet data to an array of objects
    const data = xlsx.utils.sheet_to_json(worksheet);
    const columnMappings = {
      "Nama": "nama",
      "No Whatsapp": "no_whatsapp",
    };
    const recipientDataArray = [];
    for (const row of data) {

      const recipientData = {
        // Map the Excel column name to the database field name
        [columnMappings["Nama"]]: row["Nama"],
        [columnMappings["No Whatsapp"]]: row["No Whatsapp"],
      };
      recipientDataArray.push(dosenData);
    }
    console.log(recipientDataArray);
    // Create JadwalUjian records from the Excel data
    await Dosen.bulkCreate(recipientDataArray);
    res.status(201).json({ message: 'Dosen records created from Excel.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to create Dosen records from Excel.' });
  }
};

const createRecipient = async (req, res) => {
    try {
        // Dapatkan data dosen dari body request
        const { nama,no_whatsapp} = req.body;
        // Buat objek Dosen baru
        const newRecipient = await Recipient.create({
            nama,
            no_whatsapp
        });

        // Kirim respon sukses
        res.status(201).json(newRecipient);
    } catch (error) {
        // Tangani kesalahan jika ada
        console.error(error.message);
        res.status(500).json({ error: "Gagal membuat Recipient" });
    }
};


async function updateRecipient(req, res) {
    const recipientId = req.params.id;
    try {
        const updatedRecipient= await Recipient.update(req.body, {
            where: { id: recipientId },
        });
        if (updatedRecipient[0] === 1) {
            res.status(200).json({ message: 'Recipient berhasil diperbarui.' });
        } else {
            res.status(404).json({ error: 'Recipient tidak ditemukan.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal memperbarui Recipient' });
    }
}

// const deleteRecipient = async (req, res) => {
//     try {
//       const downloadExcelTemplate = (req, res) => {
//         const templateFilePath = path.join(__dirname, 'public', 'excel-template.xlsx');
//         res.download(templateFilePath, 'excel-template.xlsx', (err) => {
//           if (err) {
//             console.error(err.message);
//             res.status(500).json({ error: 'Failed to download template file.' });
//           }
//         });
//       };
//       const recipientId = req.params.id;
  
//       // Find and update all JadwalUjian entries where id_dosen or id_pengawas matches dosenId
//       await JadwalUjian.update(
//         {
//           id: null,
//           id_pengawas: null,
//         },
//         {
//           where: {
//             [Sequelize.Op.or]: [
//               { id_dosen: dosenId },
//               { id_pengawas: dosenId },
//             ],
//           },
//         }
//       );
  
//       // After updating JadwalUjian entries, you can delete the Dosen
//       await Dosen.destroy({
//         where: {
//           id_dosen: dosenId,
//         },
//       });
  
//       res.status(200).json({ message: "Dosen Deleted" });
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   };  


  const downloadExcelTemplate = (req, res) => {
    const templateFilePath = path.join(__dirname, 'public/template/', 'excel-template.xlsx');
    res.download(templateFilePath, 'excel-template.xlsx', (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to download template file.' });
      }
    });
  };

module.exports={
    getRecipient, 
    getRecipientById,
    createBulkRecipient,
    updateRecipient,
    downloadExcelTemplate,
    createRecipient
}
