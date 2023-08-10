const e = require('express');
const puppeteer = require('puppeteer-core');
async function searchCode(user){
    const browser = await puppeteer.launch({
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
    });
    const page = await browser.newPage();
    
    await page.goto(`https://www.codechef.com/users/${user}`);
    
    const dataObj = {
        userDetails : {},
        recents : {}
    }

    //retrieving page 1 data

    dataObj.recents.page1 = {
        time : '.dataTable tbody > tr td:nth-child(1) .tooltiptext',
        link : '.dataTable tbody > tr td:nth-child(2) a',
        name : '.dataTable tbody > tr td:nth-child(2) a',
        Lang : '.dataTable tbody > tr td:nth-child(4)'
    }
    for(const key in dataObj.recents.page1){
        const data = await page.waitForSelector(dataObj.recents.page1[key]);
        if(key == "link"){
            dataObj.recents.page1[key] = await data.evaluate((e) => {
                return e.href;
            })
        }
        else {
            dataObj.recents.page1[key] = await data.evaluate((e) => {
                return e.innerHTML
            })
        }
    }




    //Waiting for second page the page to load 
    const Page2 = await browser.newPage();
    await Promise.all([
        Page2.goto(dataObj.recents.page1.link) , 
        Page2.waitForNavigation({waitUntil: 'networkidle2'}),
    ]);
    try{
        const btn = await Page2.waitForSelector('._timeUp__link_15tum_424');
        console.log("Running Try.......")
        const link = await btn.evaluate((e) => {
            return e.href;
        })
        const Page3 = await browser.newPage();
        await Promise.all([
            Page3.goto(link) , 
            Page3.waitForNavigation({waitUntil: 'networkidle2'}),
        ]);
        dataObj.recents.page2 = {
            problemTitle  : "._problem__title_15tum_856 > ._titleStatus__container_15tum_839 > h1",
            ProblemCode   : "._problemCode__box_15tum_481 ._value_15tum_488",
            contestAppeared : "._contestCode__box_15tum_559 ._contest__link_15tum_563" ,
            Difficulty : "._difficulty-ratings__box_15tum_632 ._value_15tum_488",
            tags : "._tag-list-map__box_15tum_656"
        }
        for(const key in dataObj.recents.page2){
            console.log(dataObj.recents.page2[key]);
            const data = await Page3.waitForSelector(dataObj.recents.page2[key]);
    
            if(key == "tags"){
                dataObj.recents.page2[key] = await Page3.evaluate(() => {
                    const array = [];
                    const t = document.getElementsByClassName('_tagList__item_15tum_668');
                    for(var i =0 ; i < t.length ; i++){
                        array.push(t[i].innerHTML);
                    }
                    return array;
                })
            }
            else if(key == "contestAppeared"){
                dataObj.recents.page2[key] = await data.evaluate((e) => {
                    return e.innerText
                })
    
            }
            else {
                dataObj.recents.page2[key] = await data.evaluate((e) => {
                    return e.innerHTML
                })
            }
        }
        
    }
    catch(error){
        console.log("Running Catch")
        dataObj.recents.page2 = {
            problemTitle  : "._problem__title_15tum_856 > ._titleStatus__container_15tum_839 > h1",
            ProblemCode   : "._problemCode__box_15tum_481 ._value_15tum_488",
            contestAppeared : "._contestCode__box_15tum_559 ._contest__link_15tum_563" ,
            Difficulty : "._difficulty-ratings__box_15tum_632 ._value_15tum_488",
            tags : "._tag-list-map__box_15tum_656"
        }
        for(const key in dataObj.recents.page2){
            console.log(dataObj.recents.page2[key]);
            const data = await Page2.waitForSelector(dataObj.recents.page2[key]);
    
            if(key == "tags"){
                dataObj.recents.page2[key] = await Page2.evaluate(() => {
                    const array = [];
                    const t = document.getElementsByClassName('_tagList__item_15tum_668');
                    for(var i =0 ; i < t.length ; i++){
                        array.push(t[i].innerHTML);
                    }
                    return array;
                })
            }
            else if(key == "contestAppeared"){
                dataObj.recents.page2[key] = await data.evaluate((e) => {
                    return e.innerText
                })
    
            }
            else {
                dataObj.recents.page2[key] = await data.evaluate((e) => {
                    return e.innerHTML
                })
            }
        }
    }
    
    
    
    console.log(dataObj)
    await browser.close();
}
searchCode("ayush2980");