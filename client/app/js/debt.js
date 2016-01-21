// JavaScript Document

$scope.upDebt = function(bill){
	
	   
	//$http.get('api/debt/' + bill).success(function(data) {
	var toPay = 0;
	
	for(var j = 0; j < bill.lenders.length ; j++){
		if(bill.lenders[j].amount - bill.lenders[j].part > 0)
			toPay += bill.lenders[j].amount - bill.lenders[j].part;
	}
	
	if(toPay > 0 ){
		for(var i = 0; i < bill.lenders.length ; i++){
			if(bill.lenders[i].amount - bill.lenders[i].part > 0){
				var prorata = (bill.lenders[i].amount - bill.lenders[i].part)/toPay;
				for(var j = 0; j < bill.indebted.length ; j++){
					var amount = bill.indebted[j].amount * prorata;
					$http.get("api/debt/btw/" + bill.lenders[i].user + "/" + bill.indebted[j].user ).success(function(debt) {
						var tmpDebt = {};
						if(debt.length > 0)
							tmpDebt = debt[0];
						
						tmpDebt.list_bill_amount = {
							bill : bill._id,
							amount: amount
						}
						
						if(debt.length > 0){
							tmpDebt.amount += amount;	
							$http.put("api/debt/" + tmpDebt._id , tmpDebt);
						}
						else{
							tmpDebt.lender = bill.lenders[i].user;
							tmpDebt.indebted = bill.indebted[j].user;
							$http.post("api/debt/" , tmpDebt);
						}
					});
				}
			}
		}
	}
	
}