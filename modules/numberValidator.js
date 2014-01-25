/*
	Validate the number according to these specs:
		+39 02 1234567
		That is a "+" followed by a nonempty group of digits,
		a space, a nonempty group of digits,
		a space, a group of digits with at least 6 digits.
*/
var validNumber = /^\+[0-9]{2,4} [0-9]{2,4} [0-9]{6,15}$/;
function isValid(number){
	if( number ){
		number = number + ""; //to String conversion
		number = number.trim();
		return validNumber.test( number );
	}
	return false;
}

module.exports = {
	isValid: isValid
}