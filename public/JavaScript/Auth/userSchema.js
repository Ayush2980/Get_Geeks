module.exports = {
    getFullName : (id) => {
        let userName = "user" + (id.toString()).slice(-4);
        return userName;
    }
}