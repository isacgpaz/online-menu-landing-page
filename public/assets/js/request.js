const btnMyRequest = document.querySelector('.btn-my-request');
const myRequests = document.querySelector('.my-requests');
const tableRequest = document.querySelector('.table-requests');
const btnDoRequest = document.querySelector('.btn-do-requests');
const btnFinishRequest = document.querySelector('.btn-finish-request');

btnMyRequest.addEventListener('click', showRequestList);

function showRequestList(){
    document.getElementById('menu').classList.toggle('d-none');
    myRequests.classList.toggle('d-none');
}

var requestList = [];
var request;
var total = 0;

document.querySelectorAll('tbody > tr').forEach(item => {
    item.addEventListener('click', event => {
        //console.log(item.children[0].innerHTML);
        //console.log(item.classList.contains('hover'));
        
        item.classList.toggle('selected');
        
        if(item.classList.contains('selected')){
            request = {
                name: item.children[0].innerHTML,
                price: item.children[1].innerHTML
            }
            
            if(sessionStorage.getItem('requestList')){
                requestList = JSON.parse(sessionStorage.getItem('requestList'));
            }   
            
            requestList.push(request);
            
            var requestListJSON = JSON.stringify(requestList);
            sessionStorage.setItem('requestList', requestListJSON);
        }else{
            if(sessionStorage.getItem('requestList')){
                requestList = JSON.parse(sessionStorage.getItem('requestList'));
            }
            
            for(var i = 0; i < requestList.length; i++){
                if(requestList[i].name === item.children[0].innerHTML){
                    requestList.splice(i, 1);
                    //console.log(requestList);
                }
            }
            
            var requestListJSON = JSON.stringify(requestList);
            sessionStorage.setItem('requestList', requestListJSON);
        }
        
        updateMyRequest();
    });
});

function updateMyRequest(){
    if(sessionStorage.getItem('requestList')){
        requestList = JSON.parse(sessionStorage.getItem('requestList'));
    }
    
    tableRequest.innerHTML = '';
    
    if(requestList.length == 0){
        document.querySelector('.empty').classList.remove('d-none');
        btnDoRequest.classList.add('d-none');
        document.querySelector('.specificy').classList.add('d-none');
        
        total = 0;
    }else{
        requestList.forEach(element => {
            //console.log(element);
            document.querySelector('.empty').classList.add('d-none');
            document.querySelector('.specificy').classList.remove('d-none');
            
            var tr = document.createElement('tr');
            tr.setAttribute('class', 'item');
            var tdName = document.createElement('td');
            tdName.innerHTML = element.name;
            var tdQtd = document.createElement('td');
            tdQtd.setAttribute('class', 'w-25');
            var inputQtd = document.createElement('input');
            inputQtd.setAttribute('type', 'number');
            inputQtd.setAttribute('class', 'w-100 text-center');
            inputQtd.setAttribute('min', 1);
            inputQtd.setAttribute('value', 1);
            inputQtd.setAttribute('onkeypress', 'return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57');
            tdQtd.appendChild(inputQtd);
            var tdPrice = document.createElement('td');
            tdPrice.setAttribute('class', 'text-center price req');
            tdPrice.innerHTML = element.price;
            tr.appendChild(tdName);
            tr.appendChild(tdQtd);
            tr.appendChild(tdPrice);
            tableRequest.appendChild(tr);        
            
            inputQtd.addEventListener('change', () => {
                if(inputQtd.value == '0' || inputQtd.value == ''){
                    inputQtd.value = 1;
                    tdPrice.innerHTML = element.price;
                }else{
                    inputQtd.value = inputQtd.value;
                    var price = parseFloat(element.price) * inputQtd.value;
                    tdPrice.innerHTML = price.toFixed(2).replace('.', ',');
                }
            });
            
            btnDoRequest.classList.remove('d-none');          
            
            btnDoRequest.addEventListener('click', () => {    
                total = 0;
                document.querySelectorAll('td.req').forEach(item => {
                    //console.log(parseFloat(item.innerHTML));
                    total += parseFloat(item.innerHTML);
                    //console.log(total);
                });                     
                //console.log('i: ' + i);
                //console.log('reqList: ' + requestList[i].name + ' - price: ' + requestList[i].price);
                
                //----------------> SERVIÇO DO GARÇOM / ATENDIMENTO <--------------------
                //total += (total * 10) / 100;
                
                document.querySelector('.modal-body').innerHTML = 'O valor total de seu pedido é <strong>R$ ' + total.toFixed(2).replace('.', ',') + '</strong>. Deseja acrescentar mais algo?';
            });
        });
    }
}  

sessionStorage.clear();