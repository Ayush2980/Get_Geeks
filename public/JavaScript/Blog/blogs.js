module.exports = {
  convertDate: (e) => {
    try{
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sept",
          "Oct",
          "Nov",
          "Dec",
        ];
        const date = new Date(e);
        return `${date.getHours()}:${date.getMinutes()} – ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
    catch(e){
        const {msg} = e;
        return "Some Day in World History"
    }

  },
};
