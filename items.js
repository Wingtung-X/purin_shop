// store items info
// id, name, pic, price, discription, avaliable(can change by admin)
const items = {
    "1": { id: "1", name: "Purin Fan", pic: "/image1.jpg", price: 1, description: "Description of Purin fan", available: true },
    "2": { id: "2", name: "Purin Name Tag", pic: "/image2.jpg", price: 2, description: "Description of Purin name tag", available: true },
    "3": { id: "3", name: "Shiba Purin 1", pic: "/image3.jpg", price: 3, description: "Description of shiba Purin 1", available: true },
    "4": { id: "4", name: "Good job Purin", pic: "/image4.jpg", price: 4, description: "Description of good job Purin", available: true },
    "5": { id: "5", name: "Purin Pen", pic: "/image5.jpg", price: 5, description: "Description of afternoon Purin pen", available: true },
    "6": { id: "6", name: "Shiba Purin 2", pic: "/image6.jpg", price: 6, description: "Description of shiba Purin 2", available: true },
};


function getAvailableItems() {
    return Object.values(items).filter(item => item.available);
}

function getAllItems() {
    return Object.values(items);
}

function getItem(id) {
    return items[id] || null;
}



function setItemAvailability(id, available) {
    if (!items[id]) {
        return null;
    }
    items[id].available = available;
    return items[id];
}


module.exports = {
    items,
    getAvailableItems,
    getItem,
    setItemAvailability,
    getAllItems,
};

