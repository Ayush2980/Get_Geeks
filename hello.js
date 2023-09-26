const obj = {
    friendId : [
        {
            id : 2,
            status : 1,
        },
        {
            id : 3,
            status : -1,
        }
    ]
}

let val = obj.friendId.find(o => o.id === 2 && o.status == 2);
if(val) console.log(val);