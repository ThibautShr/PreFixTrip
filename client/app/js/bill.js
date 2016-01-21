
var billManager = angular.module('billManager',["$http"]);
billManager.controller('billControl', ["$http",'$scope', function($http,$scope) {
$scope.bill = new Object()
var nbInBill=0
var group = ["pierre","paul","jacques"]
var indebted =[]
    
    var amountLent
    var lendertmp
    var indebted
   $scope.bill.lenders=[]
    $scope.bill.indebted=[]
    $scope.bill.amount=0


    $scope.addLender=function(lendername,amountLent){
	lender=new Object()
	lender.user=lendername
	lender.amount=amountLent
	lender.participate=1
	$scope.deleteLender(lender)
    	$scope.bill.amount=$scope.bill.amount+amountLent
	nbInBill=nbInBill+1
	$scope.bill.lenders.push(lender)
	$scope.update($scope.bill)
}

    $scope.addIndebted=function(indebtedname,fixedAmount){
	if($scope.bill.mode=="fix"){
		indebt=new Object()
		indebt.user=indebtedname
		indebt.amount=fixedAmount
		$scope.deleteIndebted(indebt)
		$scope.bill.indebted.push(indebt)
		nbInBill=nbInBill+1
		$scope.update($scope.bill)
	}
	if($scope.bill.mode=="egal"){
		indebt=new Object()
		indebt.user=indebtedname
		$scope.deleteIndebted(indebt)
		$scope.bill.indebted.push(indebt)
		nbInBill=nbInBill+1
		$scope.update($scope.bill)
	}
	
	
}

    $scope.selfish=function(victim){
	if(victim.participate==1){
		victim.participate=0
		victim.part=0
		nbInBill=nbInBill-1
		
	}
	else{
		victim.participate=1
		nbInBill=nbInBill+1
	}
	$scope.update($scope.bill)
	}

    $scope.deleteIndebted=function(victim){
		var tmptab=[]
		for(var i= 0; i < $scope.bill.indebted.length; i++)
		{
		var tmp=$scope.bill.indebted[i]
		if(tmp.user!=victim.user){
			tmptab.push(tmp)
		}
		else{
			nbInBill=nbInBill-1
			console.log($scope.bill.amount)		
		}
		}
		$scope.bill.indebted=tmptab
	}

	var deleteIndebtedPrivate=function(victim){
		var tmptab=[]
		for(var i= 0; i < $scope.bill.indebted.length; i++)
		{
		var tmp=$scope.bill.indebted[i]
		if(tmp.user!=victim.user){
			tmptab.push(tmp)
		}
		else{
			console.log($scope.bill.amount)		
		}
		}
		$scope.bill.indebted=tmptab
	}
	$scope.deleteLender=function(victim){
		var tmptab=[]
		for(var i= 0; i < $scope.bill.lenders.length; i++)
		{
		var tmp=$scope.bill.lenders[i]
		if(tmp.user!=victim.user){
			tmptab.push(tmp)
		}
		else{
			nbInBill=nbInBill-1
			$scope.bill.amount=$scope.bill.amount-tmp.amount		
		}
		}
		$scope.bill.lenders=tmptab
	}  
	var deleteLenderPrivate=function(victim){
		var tmptab=[]
		for(var i= 0; i < $scope.bill.lenders.length; i++)
		{
		var tmp=$scope.bill.lenders[i]
		if(tmp.user!=victim.user){
			tmptab.push(tmp)
		}
		else{
			$scope.bill.amount=$scope.bill.amount-tmp.amount		
		}
		}
		$scope.bill.lenders=tmptab
	}  


	   

    $scope.updateMode=function(){
	$scope.secondfield=$scope.bill.mode=="fix"
	}

 $scope.update=function(bill){
     
    if(bill.mode=="egal"){
	var part=bill.amount
	if(nbInBill>0){
	 part=bill.amount/nbInBill
	}
     	var indebtedtmp = bill.indebted
	bill.indebted=[]
	for(var i= 0; i < indebtedtmp.length; i++)
	{
	    indebt=new Object()
	    indebt=indebtedtmp[i]
	    indebt.amount=part
	    $scope.deleteIndebted(indebt)
	    bill.indebted.push(indebt)
	}
	for(var i= 0; i < bill.lenders.length; i++)
	{
	    tmp=bill.lenders[i]
	    if(tmp.participate==1){
		tmp.part=part
		if(tmp.amount<part){
		indebt=new Object()
		indebt.user=tmp.user
		indebt.amount=part-tmp.amount
		deleteIndebtedPrivate(indebt)
		bill.indebted.push(indebt)
		}
	    }
	    else{
		indebt=new Object()
		indebt.user=tmp.user
		deleteIndebtedPrivate(indebt)
		}
	}
    }

	if(bill.mode=="fix"){
		var total=bill.amount
		var subTotal=0
		var participatingLenders=[]
		for(var i= 0; i < bill.lenders.length; i++)
		{
			indebt=new Object()
			indebt.user=bill.lenders[i].user
			deleteIndebtedPrivate(indebt)
			if(bill.lenders[i].participate==1){
				participatingLenders.push(bill.lenders[i])
			}
			else{
				bill.lenders[i].part=0
				}
		}
		for(var i= 0; i < bill.indebted.length; i++)
		{
			subTotal=subTotal+bill.indebted[i].amount
		}
		var leftover=total-subTotal
		console.log(leftover)
		for(var i= 0; i < participatingLenders.length; i++){
			participatingLenders[i].part=leftover/participatingLenders.length
			if(participatingLenders[i].amount<participatingLenders[i].part){
					indebt.amount=participatingLenders[i].part-participatingLenders[i].amount
					bill.indebted.push(indebt)
				}
		}
		
			
    }
}





var upDebt = function(bill){
	
	   
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


$scope.finish=function(bill){
	$scope.update(bill)
	$http.post("api/bill/" , bill);
	upDebt(bill)	
}

}]);
