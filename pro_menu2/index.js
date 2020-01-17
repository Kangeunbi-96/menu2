window.addEventListener("load", function(){
    let xhr = new XMLHttpRequest;
    var nameText;
    var body = document.querySelector('body');

    xhr.open('GET', 'http://220.85.155.13:5187/categories', true);
 
    let categories = {};
    xhr.onload = function() {
        if(this.status === 200) {
            JSON.parse(this.responseText);
        }
        categories = (JSON.parse(this.responseText) || {}).categoryResponses || {};

        function initCategoryBodyBox(depth) {
            let arrNumber = [];
            for (let i = 0; i < 3; i++){
                arrNumber[i] = i + 1;
            }
            const itemToFind = arrNumber.find(function(item) {
                return item === parseInt(depth);
            });
            const idx = arrNumber.indexOf(itemToFind);
            if (idx > -1) arrNumber.splice(idx, 1);
            arrNumber.forEach(arrayIndex => {
                if(depth < parseInt(arrayIndex)) {
                    let targetTbodyNode = body.querySelector("#sec" + (arrayIndex) + " tbody");
                    if(targetTbodyNode.rows.length > 0) {
                        targetTbodyNode.querySelector('tr').remove();
                    }
                }
            })
        }
// console.log(categories);
        function insert(targetCategories, depth) {
            initCategoryBodyBox(depth);
            var targetTbodyNode = body.querySelector("#sec" + (depth + 1) + " tbody");
            targetTbodyNode.setAttribute('depth', (depth + 1));
           for(var i=0; i<targetCategories.length; i++) {
                var cloneNode = document.importNode(thumbnailCategory.content, true);
                var tds = cloneNode.querySelectorAll("td");
                var trs =  cloneNode.querySelectorAll("tr");
                var categroyNo = targetCategories[i].categoryNo;
                trs[0].setAttribute( 'categroyNo', categroyNo);
                tds[1].textContent = targetCategories[i].categoryNo;
                tds[2].textContent = targetCategories[i].name;
                targetTbodyNode.appendChild(cloneNode);
            }
            addOnclickCategory(targetTbodyNode, (depth + 1));
            allCheck(targetTbodyNode);
        }
        insert(categories, 0);

        function recursive(category, categoryNo) {
            let k = 0;
            let len = category.length;
            for (; k < len ; k++ ) {
                let targetCategory = category[k];
                if(targetCategory.categoryNo === categoryNo) return targetCategory;
                else if(targetCategory['children']) {
                    let result =  recursive(targetCategory['children'], categoryNo);
                    if (result !== false) {
                        return result;
                    }
                }
            }
            return false;
        }
        
        function addOnclickCategory(tbodyNode, depth) {
            tbodyNode.onclick = function(e) {
                var thisTd = e.target.parentElement;
                var ddd = thisTd.querySelector("input[type='checkbox']");
                if(ddd.checked === true) {
                    ddd.checked = false;
                } else { ddd.checked = true; }
                if(e.target.nodeName === 'TD') {
                    var targetCategroyNo = e.target.parentElement.getAttribute('categroyNo');
                    var targetCategory = recursive(categories, parseInt(targetCategroyNo));
                    var targetDepth = e.target.closest('tbody').getAttribute('depth');
                    
                    nameClick(thisTd, targetCategory);
                    if(targetCategory.children.length > 0) {
                        insert(targetCategory.children, parseInt(targetDepth));
                        return;
                    } 
                }
                allCheck(tbodyNode, depth, targetCategory);
                bgChange(thisTd, tbodyNode);
            }
        }

        function allCheck(targetTbodyNode, depth, targetCategory) {
            checkDelete(targetTbodyNode, depth);
            var allCheckbox = targetTbodyNode.parentElement.querySelector(".overall-checkbox");
            allCheckbox.onchange = function() {
                checkDelete(targetTbodyNode, depth);
                var inputs = targetTbodyNode.querySelectorAll("input[type='checkbox']");
                for(var i = 0; i < inputs.length; i++) {
                    inputs[i].checked = allCheckbox.checked;
                }
            };
            listSwap(targetTbodyNode, targetCategory);
        }

        function listSwap(targetTbodyNode, targetCategory) {
            var swapButton = document.querySelector(".swap-button");
            swapButton.onclick = function() {
                var inputs = targetTbodyNode.querySelectorAll("input[type='checkbox']:checked");
                if(inputs.length != 2) {
                    alert("엘리먼트는 2개만 선택해야만 합니다.");
                    return;
                }
                var trs = [];
                var dd = [];

                for(var i = 0; i < inputs.length; i++) {
                    trs.push(inputs[i].parentElement.parentElement);
                    // dd.push(targetCategory);
                }
                // console.log(dd);
                
                var cloneNode = trs[0].cloneNode(true);
                trs[1].replaceWith(cloneNode);
                trs[0].replaceWith(trs[1]);
                // console.log('trs[1]',trs[1]);
                changeData();
            };
        }

        function checkDelete(targetTbodyNode, depth) {
            var delButton = document.querySelector(".del-button");
            
            delButton.onclick = function() {
                var inputs = targetTbodyNode.querySelectorAll("input[type='checkbox']:checked");
                let arrNumber = [];
                for (let i = 0; i < 3; i++) {
                    arrNumber[i] = i + 1;
                }
                if(inputs.length != 1) {
                    alert("엘리먼트는 1개만 선택해야만 합니다.");
                    return;
                }
                for(var i = 0; i < inputs.length; i++) {
                    inputs[i].parentElement.parentElement.remove();
                    arrNumber.forEach(arrayIndex => {
                        if(depth < parseInt(arrayIndex)) {
                            let targetTbodyNode1 = body.querySelector("#sec" + (arrayIndex) + " tbody");
                            if(targetTbodyNode1.rows.length > 0) {
                                targetTbodyNode1.querySelector('tr').remove();
                            }
                        }
                    })
                }
                changeData();
            };
        }

        function bgChange(td, tbodyNode) {
            for(var i = 0; i < tbodyNode.children.length; i++) {
                tbodyNode.children[i].style.backgroundColor = '#fff';
            }
            // td.style.backgroundColor = 'gold';
        }

        function changeData() {
            var changeButton = document.querySelector(".change-button");
            changeButton.onclick = function(e) {
                var xhr1 = new XMLHttpRequest();

                xhr1.open("POST", "http://220.85.155.13:5187/categories");
                xhr1.setRequestHeader("Content-Type", "application/json");

                let data = { categoryRequests: categories };
                xhr1.send(JSON.stringify(data));
            }
        }

        function nameClick(thisTd,targetCategory) { //팝업창 뜨기 닫기
            thisTd.ondblclick = function() {
                nameText = this;
                var overlay = body.querySelector('.black_overlay');
                var popup = body.querySelector('.popup');
                var store = body.querySelector('#button');
                var pushText = body.querySelector('#pushtext');
                
                popup.style.display = 'block';
                overlay.style.display = 'block';

                store.onclick = function() {
                    nameText.children[2].textContent = pushText.value
                    popup.style.display = 'none';
                    overlay.style.display = 'none';
                    targetCategory.name = pushText.value;
                    pushText.value = null;
                    changeData();
                }
            }
        }
    };
    xhr.send();
});