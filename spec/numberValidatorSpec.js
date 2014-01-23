var numberValidator = require('../modules/numberValidator');

describe('numberValidator', function(){
	it('is a valid number (+39 0471 707090)', function(){
		expect( numberValidator.isValid('+39 0471 707090') )
			.toBeTruthy();
	});
	it('is a valid number (+39 345 4455667)', function(){
		expect( numberValidator.isValid('+39 345 4455667') )
			.toBeTruthy();
	});
	it('is an invalid number (+39 0)', function(){
		expect(	numberValidator.isValid('+39 0') )
			.toBeFalsy()
	});
	it('is an invalid number (null)', function(){
		expect( numberValidator.isValid(null) )
			.toBeFalsy();
	});
	it('is an invalid number (+39	0471	707090)', function(){
		expect( numberValidator.isValid('+39	0471	707090') )
			.toBeFalsy();
	});
	it('is an invalid number (+39\n0471\n707090)', function(){
		expect( numberValidator.isValid('+39\n0471\n707090') )
			.toBeFalsy();
	});
});