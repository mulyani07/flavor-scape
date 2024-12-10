/** @format */

const { Firestore } = require("@google-cloud/firestore");

// Fungsi untuk memformat data dokumen Firestore
function modelData(doc) {
	return {
		id: doc.id,
		history: {
			result: doc.data().result,
			createdAt: doc.data().createdAt,
			suggestion: doc.data().suggestion,
			id: doc.id,
		},
	};
}

// Fungsi untuk menginisialisasi koneksi ke Firestore
async function database() {
	const settings = {
		projectId: process.env.PROJECT_ID,
	};
	return new Firestore(process.env.APP_ENV === "local" ? settings : undefined);
}

// Fungsi untuk menyimpan data hasil pemindaian
async function storeData(id, data) {
	const ingredientCollection = (await database()).collection("ingredientScans"); // Nama koleksi diubah
	return ingredientCollection.doc(id).set(data);
}

// Fungsi untuk mengambil data hasil pemindaian
async function getData(id = null) {
	const ingredientCollection = (await database()).collection("ingredientScans"); // Nama koleksi diubah
	if (id) {
		const doc = await ingredientCollection.doc(id).get();
		if (!doc.exists) return null;
		return modelData(doc);
	} else {
		const snapshot = await ingredientCollection.get();
		const allData = [];
		snapshot.forEach(doc => allData.push(modelData(doc)));
		return allData;
	}
}

module.exports = { storeData, getData, modelData };
