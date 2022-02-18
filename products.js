import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

const url ='https://vue3-course-api.hexschool.io/v2';
const path ='caiji-hexschool';

let myModal='';
let delProductModal='';

const app = createApp({
    data(){
        return{
            temp:{
                category:'',
                imagesUrl:[]
            },
            products:[],
            radioCategory:'odd',
            isNew:true
        }
    },
    mounted(){
        this.checkLogin();
        // const modal = document.querySelector('#productModal');
       myModal = new bootstrap.Modal(document.querySelector('#productModal'));
        delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'));
    },
    watch:{
        radioCategory(current){
            if(this.radioCategory==='new' || this.radioCategory==='odd'){
                this.temp.category='';
            }
        }
    },
    methods:{
        checkLogin(){
            const Token = document.cookie.replace(/(?:(?:^|.*;\s*)hextoken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common['Authorization'] = Token;

            axios.post(`${url}/api/user/check`)
            .then((res) =>{
                console.log(res);
                this.getProducts();
            })
            .catch((err) => {
                console.log(err);
                alert('驗證錯誤，請重新登入')
                window.location='./index.html';
            })
        },
        getProducts(){
            axios.get(`${url}/api/${path}/admin/products/all`)
            .then((res) => {
                console.log(res);
                this.products = res.data.products;
            })
            .catch((err) => {
                console.log(err);
            })
        },
        updateProduct(){
            let site = `${url}/api/${path}/admin/product`;
            let method ='post';
            let errText = '新增失敗';
            if(!this.isNew){
                site =  `${url}/api/${path}/admin/product/${this.temp.id}`;
                method = 'put';
                errText = '編輯失敗';
            }
               
            axios[method](site,{data:this.temp})
            .then((res) => {
                console.log(res);
                myModal.hide();
                this.temp={
                    category:'',
                    imagesUrl:[]
                };
                this.radioCategory='odd';
                this.getProducts();
            })
            .catch((err) => {
                console.log(err);
                alert(errText);
            })
        },
        productsModal(status,product){
            if(status==='isNew'){
                this.temp={
                    category:'',
                    imagesUrl:[]
                };
                this.isNew = true;
                myModal.show();
            }else if(status==='edit'){
                //↓ 因物件傳參考 編輯時立即影響畫面內容
                // this.temp=product;
                //因畫面(產品列表)沒有圖片 所以可以淺層拷貝就好
                // this.temp = {...product};
                //深層拷貝↓
                this.temp = JSON.parse(JSON.stringify(product));
                if(this.temp.imagesUrl){
                    this.isNew = false;
                    myModal.show();
                }else{
                    this.temp.imagesUrl=[];
                    this.isNew = false;
                    myModal.show();
                }
            }else if(status==='del'){
               
                // this.temp = {...product};
                this.temp = JSON.parse(JSON.stringify(product));
                delProductModal.show();
            }   
        },
        delProductModal(){
            axios.delete(`${url}/api/${path}/admin/product/${this.temp.id}`)
            .then((res) => {
                console.log(res);
                this.getProducts();
                delProductModal.hide();
            })
            .catch((err) => {
                console.log(err);
                alert('刪除產品失敗');
            })
        }
    },
    computed:{
        setCategory(){
            const categoryArray=Object.values(this.products);
            // categoryArray.forEach((item) => {
            //     console.log(item.category);
            // })
            let newCategoryArray={};
            newCategoryArray= new Set(categoryArray.map(item => item.category));
            // console.log(newCategoryArray);
            return newCategoryArray;
        }
    }
       
    
    
})


app.mount('#app');