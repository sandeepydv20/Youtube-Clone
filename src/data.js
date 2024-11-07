export const API_KEY = 'AIzaSyA4jwNUPs4aR9murTuj9gbok24WoJzLWME';

export const  value_convertor = (value) =>{
    if (value >= 1000000) {
        return Math.floor(value/1000000)+"M";
    }
    else if(value>=1000){
        return Math.floor(value/1000)+"k";
    }
    else{
        return value;
    }
}