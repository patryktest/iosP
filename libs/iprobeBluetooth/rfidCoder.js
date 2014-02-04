decodeDataRFID = function(string){
				//data ='   3005FB63AC1F3681EC880468';
	var binNumber = hex2bin(string);
	var companyNumberLength=0;
	var caiLength = 0;
	var EPCheader = parseInt(binNumber.substr(0,8),2);
	var filter = parseInt(binNumber.substr(8,3),2);
	var partition = parseInt(binNumber.substr(11,3),2);
	var encodedData = string;
	var michelin = null;
	
	if((string.substr(0,9) === '301854AAC' || string.substr(0,9) === '307854AAC')){
		michelin = true;
	}
	else
		michelin = false;
	
	
	switch(partition){
		case 0:
			companyNumberLength = 40;
			caiLength = 4;
			break;
		case 1:
			companyNumberLength = 37;
			caiLength = 7;
			break;
		case 2:
			companyNumberLength = 34;
			caiLength = 10;
			break;
		case 3:
			companyNumberLength = 30;
			caiLength = 14;
			break;
		case 4:
			companyNumberLength = 27;
			caiLength = 17;
			break;
		case 5:
			companyNumberLength = 24;
			caiLength = 20;
			break;
		case 6:
			companyNumberLength = 20;
			caiLength = 24;
			break;
	}
	var companyPrefix = parseInt(binNumber.substr(14,companyNumberLength),2);
	var cai = parseInt(binNumber.substr(14+companyNumberLength,caiLength),2);
	var sn = parseInt(binNumber.substr(14+companyNumberLength+caiLength,binNumber.length-1),2);
	
	return {EPCheader:EPCheader,filter:filter,partition:partition,companyPrefix:companyPrefix,cai:cai,sn:sn,encodedData:encodedData,michelin:michelin};
}
/**
 * 
 * @param {hexa code} data
 * @returns {String} matricule 
 * example data: 65 92 B1 C3 9E 38 20 0000000000
 * example return: "YYJ10988H"
 */
decodeRFIDDataFromUserArea = function(data){
    var hexa_data = data.substr(0,14)
    var bin_data = hex2bin(hexa_data);
    var decodedData = '';
    var decodedPart = 1;
    for(var i=0;i<bin_data.length;i+=6){
        if(decodedPart<4 || decodedPart>8)
            decodedData += decode6BitToChar(bin_data.substr(i,6),'ch');
        else
            decodedData += decode6BitToChar(bin_data.substr(i,6),'n');
        decodedPart++;
    }
    return decodedData;
    
}

hex2bin = function(hex){
	var bin;
	var hex_part1 = hex.substr(0,12);
	var hex_part2 = hex.substr(12,hex.length-12);
	var hex_part1_length = hex_part1.length;
	var hex_part2_length = hex_part2.length;
	
	var bin_part1 = parseInt(hex_part1,16).toString(2);
	var bin_part2 = parseInt(hex_part2,16).toString(2);
	
	bin = zeroToStart(bin_part1,hex_part1_length*4)+zeroToStart(bin_part2,hex_part2_length*4);
	return bin;
}
bin2hex = function(bin){
	var hex;
        var bin_part1 = bin.substr(0,24);
        var bin_part2 = bin.substr(24,bin.length-24);
        var bin_part1_length = bin_part1.length;
        var bin_part2_length = bin_part2.length;
        
        var hex_part1 = parseInt(bin_part1,2).toString(16);
        var hex_part2 = parseInt(bin_part2,2).toString(16);
        
        hex = zeroToStart(hex_part1,bin_part1_length/4)+zeroToStart(hex_part2,bin_part2_length/4);
	//hex = parseInt(bin,2).toString(16);
	return hex;
}

zeroToStart = function(_string,_length){
	var string = _string;
	var length = _length;
	
	for(var i=string.length;i<length;i++)
		string = "0"+string;

	return string;
}
