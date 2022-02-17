const AllWordsSchema = require('../../db/models/allWords-schema/index');
const ShownWordsSchema = require('../../db/models/shownWords-schema')
const {
    allTranslationsArray,
    allWordsArray
} = require('../../services/allWords.services');

module.exports.postAllWordsToDb = async (req, res) => {
    try {
        const newAllWords = new AllWordsSchema({
            words: allWordsArray,
            translations: allTranslationsArray,
        });

        await newAllWords
            .save()
            .then(() => {
                res.status(200).json({ message: 'all words are succesfully added to DB' })
            });
    } catch (e) {
        res.status(500).send({ message: 'Internal server error' });
    }
}

module.exports.getRandomWord = async (req, res) => {
    try {
        const result = await AllWordsSchema.find();
        const allWords = result[0];

        const index = Math.floor(Math.random() * allWords.words.length);
        const randomWord = allWords.words[index];
        const randomTransl = allWords.translations[index];
        
        res.status(200).send({
            word: randomWord,
            translation: randomTransl,
        });
    } catch (e) {
        res.status(500).send({ message: 'Internal server error' });
    }
}

module.exports.handleStudiedWord = async (req, res) => {
    try {
        const { reqWord, reqTransl } = req.body;

        if (!reqWord || !reqTransl) {
            return res.status(400).send('Data is incorrect!');
        }

        const result = await AllWordsSchema.find();
        const allWords = result[0];

        const words = allWords.words.filter(w => w !== reqWord);
        const translations = allWords.translations.filter(t => t !== reqTransl);

        if ((words.length === allWords.words.length)
        || translations.length === allWords.translations.length) {
            return res.status(500).send({ message: 'the word or the translation is not found' });
        }

        await AllWordsSchema.findOneAndUpdate({ result }, {
            words,
            translations
        }, {
            new: true
        }).catch((e) => {
            res.status(500).send({ message: e.message });
        })

        const shownWords = new ShownWordsSchema({
            word: reqWord,
            translation: reqTransl,
        });

        shownWords.save()
            .then(() => {
                res.status(400).send('Success');
            })
    } catch (e) {
        res.status(500).send({ message: 'internal server error' });
    }
}