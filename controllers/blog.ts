import { renderFileToString } from 'https://deno.land/x/dejs/mod.ts';
import { insert, select } from '../models/pg_model.ts';
import TSql from '../models/sql.ts';

const home = async({response} : {response : any}) => {
    const dataTable = await select(
        [
            {text : TSql['KtgFindAll']},
            {text : TSql ['BlogInfoFindAll']}
        ]
        );
    const html = await renderFileToString ("./views/home.ejs", {
        data: {
            pemrograman : dataTable[0],
            blogInfo : dataTable[1]
        },
        subview :{
            namafile : "./views/blog-main.ejs",
            showjumbotron : true
        }
    });
    response.body = new TextEncoder().encode(html);
}
const signup = async({response, request, state} : {response : any, request : any, state : any}) => {
    if(!request.hasBody) {
        let signupError : string = '';
        if((state.pesanError != undefined) && (state.pesanError != '')) {
            signupError = state.pesanError;
        }
        const html = await renderFileToString ("./views/home.ejs", {
            data : {
                pemrograman : await select ({
                    text : TSql['KtgFindInKode'],
                    args : ['php', 'ts', 'js']
                }),
                statusSignup : signupError,
                blogInfo : await select({
                    text : TSql['BlogInfoFindAll']
                })
            },
            subview : {
                namafile : "./views/signup.ejs",
                showjumbotron : false
            }
        })
        response.body = new TextEncoder().encode(html);
    } else {
    const body = await request.body().value;
    const parseData = new URLSearchParams(body);
    const namalengkap = parseData.get("fullname"); 
    const namauser = parseData.get("username"); 
    const pwd = parseData.get("password"); 

    let hasil = await insert({
        text : TSql['InsUser'],
        args : [namauser, namalengkap, pwd]
    });

    if(hasil[0] == 'Sukses'){
        state.pesanError = '';
        response.body = "Sukses menyimpan data ke database";
    } else {
        state.pesanError = hasil[1];
        response.redirect('/daftar');
        }
    }
}
const kategori = async ({params, response} : {params : {id : string}, response : any}) => {
    response.body = "ID Parameter :"+ params.id;
}
export { home, signup, kategori }