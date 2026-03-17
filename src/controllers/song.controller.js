const songModel = require("../models/song.model")
const storageService = require("../services/storage.service")
const id3 = require("node-id3")


async function uploadSong(req, res) {

    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }

    const songBuffer = req.file.buffer;
    const { mood } = req.body;

    const tags = id3.read(songBuffer);

    const title = tags.title || "unknown";

    // ✅ SAFE access
    const posterBuffer = tags.image?.imageBuffer;

    if (!posterBuffer) {
        return res.status(400).json({
            message: "MP3 must contain cover image"
        });
    }

    const [songFile, posterFile] = await Promise.all([
        storageService.uploadFile({
            buffer: songBuffer,
            filename: title + ".mp3",
            folder: "/cohort-2/moodify/songs"
        }),
        storageService.uploadFile({
            buffer: posterBuffer,
            filename: title + ".jpeg",
            folder: "/cohort-2/moodify/posters"
        })
    ]);

    const song = await songModel.create({
        title,
        url: songFile.url,
        posterUrl: posterFile.url, // ⚠️ match schema name
        mood
    });

    res.status(201).json({
        message: "song created successfully",
        song
    });
}



async function getSong(req, res) {

    const { mood } = req.query

    const song = await songModel.findOne({
        mood,
    })

    res.status(200).json({
        message: "song fetched successfully.",
        song,
    })

}


module.exports = { uploadSong, getSong }