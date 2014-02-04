decodeWUS = function(hex){
	var bin = hex2bin(hex);
	var dataObject = null;
	
	if(bin.substr(0,2)=="00")
		dataObject = decodeMichelinDataWUS(bin);
	else
		dataObject = decodeStandartDataWUS(bin);
		
	return dataObject;
}
/**
 * endcode standart data for writting to TPMS memmory
 * set partition default to '01' if filter ==6 => '11'
 * 
 * @param {Number} partition
 * @param {Number} cai
 * @param {Number} serial_number
 * @returns {hexa number}
 */
encodeStandartDataWUS = function(partition,cai,serial_number){
	var cai_part = zeroToStart(Number(cai).toString(2),24);
	var sn_part = zeroToStart(Number(serial_number).toString(2),38);
	var partition_part = '01';
	
	if(Number(partition)==6)
		partition_part = '11';
	
	console.log('bin num'+partition_part+cai_part+sn_part);
	console.log('hexanum'+zeroToStart(bin2hex(partition_part+cai_part+sn_part),16));
	return zeroToStart(bin2hex(partition_part+cai_part+sn_part),16);

}

decodeStandartDataWUS = function(bin){
	var cai = parseInt(bin.substr(2,24),2);
	var sn = parseInt(bin.substr(26,38),2);
	return {michelin:false,cai:cai,sn:sn};
	
}
/**
 * endcode standart data for writting to TPMS memmory
 * set partition default to '00'
 * 
 * @param {Number} cai
 * @param {String} matricule
 * @returns {unresolved}
 */
encodeMichelinDataWUS = function(cai,matricule){
	var number_part = cai+matricule.substr(3,5);
	var string_part = matricule.substr(0,3)+matricule.substr(8,1);
	var encode_data = "";
	var partition_part = '00';

	var encode_number = zeroToStart(Number(number_part).toString(2),37);
	var encode_string = encodeStringTo5BitChar(string_part);
	
	encode_data = encode_number+encode_string;
	encode_data = partition_part+zeroToStart(encode_data,62); 	// add michelin partition 00 and set data to 64 bit
	encode_data= zeroToStart(bin2hex(encode_data),16);						// convert data to hexa and set to size 16 char;
	return encode_data;
}

decodeMichelinDataWUS = function(bin){
	console.log(bin);
	var number_part = String(parseInt(bin.substr(2,42),2));
	var string_part = decodeString(bin.substr(44,20));
	var cai = number_part.substr(0,6);
	var matricule = string_part.substr(0,3)+number_part.substr(6,number_part.length-1)+string_part.substr(3,1);
	return {michelin:true,cai:cai,matricule:matricule};
}

encodeStringTo5BitChar = function(string){
	var encoded_string = "";
	for(var i=0;i<string.length;i++){
		encoded_string += encodeCharTo5Bit(string[i]);
	}
	return encoded_string;
}

encodeCharTo5Bit = function(char){
	var encode_char = char.charCodeAt(0).toString(2);
	var encode_char5bit = encode_char.substr(encode_char.length-5,5);
	
	return encode_char5bit;
}

decodeString = function(bin){
	var decode_string = "";
	for(var i=0;i<bin.length;i+=5){
		decode_string += decodeChar(bin.substr(i,5));
	}
	return decode_string;
}
decodeChar = function(bin){
	return String.fromCharCode(parseInt('10'+bin,2));
}

/**
 * 
 * @param {6 bit number, type of decode data n-number/ch-char} data
 * @returns {char}
 * 
 * decode char from 6 bit bin number
 */

decode6BitToChar = function(binNum,type){
    if(binNum.length>6){console.log('decode6BitToCharacter: num>6');return;}
    switch(type){
        case 'ch':
            binNum = "1"+binNum;
            break;
        case 'n':
            binNum = '0'+binNum;
            break;
    }
    return String.fromCharCode(parseInt(binNum,2));
};


