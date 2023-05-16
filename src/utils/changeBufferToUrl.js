export const getavatarUrl = function(buf,callback){
    const blob = new Blob([new Uint8Array(buf.data)],{type:'image/jpeg'});
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = function(){
        callback(reader.result);
    }
}