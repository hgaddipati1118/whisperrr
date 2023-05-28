import { format } from 'date-fns';

function formatBday(bday){
    return format(new Date(bday), "PP");
}

function formatGender(gender){
    if(gender == "M"){
        return "Male";
    }
    if(gender == "F"){
        return "Female";
    }
    if(gender == "NB"){
        return "Non-Binary";
    }
    if(gender == "O"){
        return "Other";
    }
}

function formatPreferredGender(preferred_gender){
    preferred_gender = [... new Set(preferred_gender)];
    preferred_gender = preferred_gender.map((gender)=>(gender == "M")?"Male":((gender == "F")?"Female":(gender == "NB"?"Non-Binary":"All")));
    preferred_gender.sort();
    let genderString = preferred_gender[0];
    for(let i = 1; i<preferred_gender.length; i++){
        genderString += ", " + preferred_gender[i];
    }
    if(preferred_gender.includes("All")){
        genderString = "All";
    }
    preferred_gender = genderString;
    return preferred_gender;
}
export{formatBday, formatGender, formatPreferredGender};