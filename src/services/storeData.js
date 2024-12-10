const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();

const storeData = async (collection, data) => {
    try {
        await firestore.collection(collection).add(data);
        console.log('Data stored successfully');
    } catch (error) {
        throw new Error('Error storing data: ' + error.message);
    }
};

module.exports = storeData;
