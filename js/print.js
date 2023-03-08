window.addEventListener('message', function (event) {
    if (event.data.file && event.data.data) {
        const workbook = XLSX.read(event.data.data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 'A', defval: '' });
        const urlParams = new URLSearchParams(window.location.search);
        var bank = JSON.parse(urlParams.get('bank'));
        document.title = JSON.parse(urlParams.get('name'));
        for (var i = 1; i < sheetData.length; i++) {
            var cheque_div = document.createElement("div")
            var name1 = document.createElement("div")
            var amount_num = document.createElement("div")
            var amount_letters = document.createElement("div")
            var date = document.createElement("div")
            var sign = document.createElement("div")
            var place = document.createElement("div")
            var back = document.createElement("div")
            const stylesheet = document.styleSheets[0];
            const mediaRule = Array.from(stylesheet.rules).find(
                (rule) => rule.media && rule.media.mediaText === 'print'
            );
            back.className = 'background';
            name1.className = 'common-dev';
            name1.innerHTML = sheetData[i].B;
            amount_num.className = 'common-dev';
            amount_num.innerHTML = "#" + sheetData[i].C + "#";
            amount_letters.className = 'common-dev';
            amount_letters.innerHTML = "فقط " + tafqeet(sheetData[i].C) + " جنيه مصري لا غير";
            date.className = 'common-dev';
            date.innerHTML = sheetData[i].D;
            sign.className = 'common-dev';
            sign.innerHTML = sheetData[i].E;
            place.className = 'common-dev';
            place.innerHTML = sheetData[i].F;
            back.style.backgroundImage = "url('" + bank + ".jpg')";
            cheque_div.className = bank + "-div";
            if (i == sheetData.length - 1) {
                cheque_div.style.pageBreakAfter = "avoid";
            }
            else {
                cheque_div.style.pageBreakAfter = "always";

            }


            switch (bank) {
                case "nbe":
                    {
                        const pageSizeRule = `@page { size: 627px 295px; }`;
                        mediaRule.insertRule(pageSizeRule, mediaRule.cssRules.length);
                        back.style.backgroundSize = "627px 291px";
                        date.style.paddingTop = "55px"
                        date.style.paddingRight = "35px"
                        place.style.paddingTop = "55px"
                        place.style.paddingRight = "150px"
                        amount_num.style.paddingTop = "140px"
                        amount_num.style.paddingRight = "30px"
                        amount_letters.style.paddingTop = "140px"
                        amount_letters.style.paddingRight = "210px"
                        name1.style.paddingTop = "85px"
                        name1.style.paddingRight = "140px"
                        sign.style.paddingTop = "175px"
                        sign.style.paddingRight = "80px"
                        break;
                    }
                case "boc":
                    {
                        const pageSizeRule = `@page { size: 611px 313px; }`;
                        mediaRule.insertRule(pageSizeRule, mediaRule.cssRules.length);
                        back.style.backgroundSize = "611px 313px";
                        date.style.paddingTop = "65px"
                        date.style.paddingRight = "75px"
                        place.style.paddingTop = "30px"
                        place.style.paddingRight = "115px"
                        amount_num.style.paddingTop = "160px"
                        amount_num.style.paddingRight = "55px"
                        amount_letters.style.paddingTop = "150px"
                        amount_letters.style.paddingRight = "265px"
                        name1.style.paddingTop = "105px"
                        name1.style.paddingRight = "155px"
                        sign.style.paddingTop = "200px"
                        sign.style.paddingRight = "45px"
                        break;
                    }
                case "wafa":
                    {
                        const pageSizeRule = `@page { size: 638px 340px; }`;
                        mediaRule.insertRule(pageSizeRule, mediaRule.cssRules.length);
                        back.style.backgroundSize = "638px 336px";
                        date.style.paddingTop = "70px"
                        date.style.paddingRight = "50px"
                        place.style.paddingTop = "70px"
                        place.style.paddingRight = "250px"
                        amount_num.style.paddingTop = "175px"
                        amount_num.style.paddingRight = "50px"
                        amount_letters.style.paddingTop = "145px"
                        amount_letters.style.paddingRight = "280px"
                        amount_letters.style.paddingLeft = "80px"
                        name1.style.paddingTop = "110px"
                        name1.style.paddingRight = "160px"
                        sign.style.paddingTop = "200px"
                        sign.style.paddingRight = "70px"
                        break;
                    }
                case "qnb":
                    {
                        const pageSizeRule = `@page { size: 635px 317px; }`;
                        mediaRule.insertRule(pageSizeRule, mediaRule.cssRules.length);
                        back.style.backgroundSize = "635px 314px";
                        date.style.paddingTop = "50px"
                        date.style.paddingRight = "55px"
                        amount_num.style.paddingTop = "145px"
                        amount_num.style.paddingRight = "30px"
                        amount_letters.style.paddingTop = "135px"
                        amount_letters.style.paddingRight = "250px"
                        amount_letters.style.paddingLeft = "90px"
                        name1.style.paddingTop = "95px"
                        name1.style.paddingRight = "90px"
                        sign.style.paddingTop = "240px"
                        sign.style.paddingRight = "40px"
                        place.innerHTML = ""
                        break;
                    }
                case "misr":
                    {
                        const pageSizeRule = `@page { size: 609px 317px; }`;
                        mediaRule.insertRule(pageSizeRule, mediaRule.cssRules.length);
                        back.style.backgroundSize = "609px 314px";
                        date.style.paddingTop = "20px"
                        date.style.paddingRight = "50px"
                        amount_num.style.paddingTop = "125px"
                        amount_num.style.paddingRight = "30px"
                        amount_letters.style.paddingTop = "130px"
                        amount_letters.style.paddingRight = "170px"
                        name1.style.paddingTop = "75px"
                        name1.style.paddingRight = "130px"
                        sign.style.paddingTop = "170px"
                        sign.style.paddingRight = "330px"
                        place.innerHTML = ""
                        break;
                    }
            }
            cheque_div.appendChild(back);
            cheque_div.appendChild(name1);
            cheque_div.appendChild(amount_num);
            cheque_div.appendChild(date);
            cheque_div.appendChild(sign);
            cheque_div.appendChild(place);
            cheque_div.appendChild(amount_letters);
            document.body.appendChild(cheque_div);
        }
    }
});
