import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

const app = createApp({
    data(){
        return{
            user:{
                username:'',
                password:''
            }
        }
    },
    methods:{
        login(){
            
            const url='https://vue3-course-api.hexschool.io/v2';
            const path ='caiji-hexschool';

            if(this.user.username=='' || this.user.password==''){
                alert('請輸入帳號及密碼');
                return;
            }
           
            axios.post(`${url}/admin/signin`,this.user)
            .then((res) => {
                console.log(res);
                const {token , expires} = res.data;
                document.cookie = `hextoken=${token}; expires=${new Date(expires)}`;
                window.location='./products.html';
 
            })
            .catch((err) => {
                console.log(err);
                this.user.username='';
                this.user.password='';
                alert('登入失敗');
            })
        }
    }
})

app.mount('#app');