
var billManager = angular.module('billManager',[]);
billManager.controller('billControl', ['$scope', function($scope) {
$scope.bill = new Object()
var nbInBill=0
$scope.group={users:[{pseudo:"Yedir"},{pseudo:"Adrien"},{pseudo:"Audrey"},{pseudo:"Eva"}]}
//$http.get("api/group/"+$scope.groups[$scope.indexCurrentGroup]._id,fuction(data){$scope.group=data});
var indebted =[]
    
    var amountLent
    var lendertmp
    var indebted
    $scope.nblendleft=0
   $scope.bill.lenders=[]
    $scope.bill.indebted=[]
    $scope.bill.amount=0
    $scope.subtotal=0
    $scope.left=0

    $scope.addLender=function(lendername,amountLent){
	if (amountLent>0){
	lender=new Object()
	lender.user=lendername
	lender.amount=amountLent
	lender.participate=1
	$scope.deleteLender(lender)
    	$scope.bill.amount=$scope.bill.amount+amountLent
	nbInBill=nbInBill+1
	deleteIndebtedPrivate(lender)
	$scope.bill.lenders.push(lender)
	console.log(lender)
	$scope.update($scope.bill)
	}
	else{
		alert("montant invalide")
	}
}


var fixaddIndebted=function(indebtedname,fixedAmount){

	if(fixedAmount>0.01 && fixedAmount<=$scope.left){
			indebt=new Object()
			indebt.user=indebtedname
			deleteIndebtedPrivate(indebt)
			indebt.amount=fixedAmount
			$scope.bill.indebted.push(indebt)
			nbInBill=nbInBill+1
			$scope.update($scope.bill)
	}
	else{
		alert("montant incorrect, il doit être d'au moins 1 centime et ne doit pas exceder la somme restante à rembourser") 
	}
}



var isLender=function(name){
	for(var i= 0; i < $scope.bill.lenders.length; i++)
		{
		if ($scope.bill.lenders[i].user==name){
			return true
		}
			
		}
	return false


}




var egaladdIndebted=function(indebtedname){
		if(!isLender(indebtedname)){
		indebt=new Object()
		nbInBill=nbInBill+1
		cleanlenders($scope.bill)
		indebt.user=indebtedname
		deleteIndebtedPrivateMinus(indebt)
		$scope.bill.indebted.push(indebt)
		$scope.update($scope.bill)
		}
}



$scope.addIndebted=function(indebtedname,fixedAmount){
	if($scope.bill.mode=="fix"){
		fixaddIndebted(indebtedname,fixedAmount)
	}
	if($scope.bill.mode=="egal"){
		egaladdIndebted(indebtedname)
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
	}
	}
	$scope.bill.indebted=tmptab
	$scope.update($scope.bill)
}

var deleteIndebtedPrivateMinus=function(victim){
	var tmptab=[]
	console.log($scope.bill.indebted.length)
	for(var i= 0; i < $scope.bill.indebted.length; i++)
	{
	var tmp=$scope.bill.indebted[i]
	console.log(victim.user)
	if(tmp.user!=victim.user){
		tmptab.push(tmp)
	}
	else{
		nbInBill=nbInBill-1	
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
			if(victim.participate==1){
				nbInBill=nbInBill-1
			}
			$scope.bill.amount=$scope.bill.amount-tmp.amount		
		}
		}
		$scope.bill.lenders=tmptab
		$scope.update($scope.bill)
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




var cleanlenders=function(bill){
for(var i= 0; i < bill.lenders.length; i++)
	{
	    	tmp=bill.lenders[i]
		indebt=new Object()
		indebt.user=tmp.user
		deleteIndebtedPrivateMinus(indebt)
		
	}
}


var updateEgal=function(bill){
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
	    deleteIndebtedPrivate(indebt)
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
		console.log(part)
		console.log("-")
		console.log(tmp.amount)
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


var updateFix=function(bill){
		var total=bill.amount
		var subTotal=0
		var participatingLenders=[]
		for(var i= 0; i < bill.lenders.length; i++)
		{
			indebt=new Object()
			indebt.user=bill.lenders[i].user
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
		$scope.nblendleft=participatingLenders.length
		$scope.subtotal=subTotal
		var leftover=total-subTotal
		$scope.left=leftover
		for(var i= 0; i < participatingLenders.length; i++){
			participatingLenders[i].part=leftover/participatingLenders.length
			if(participatingLenders[i].amount<participatingLenders[i].part){
					indebt.amount=participatingLenders[i].part-participatingLenders[i].amount
					bill.indebted.push(indebt)
				}
		}
}

$scope.update=function(bill){
     
    if(bill.mode=="egal"){
	updateEgal(bill)
    }

    if(bill.mode=="fix"){
	updateFix(bill)			
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

	if(bill.amount>0){
	if(bill.mode=="fix"){
		if ($scope.nblendleft==0 && $scope.left!=0){
			alert("il manque "+$scope.left+"€ à rembourser")
			return
		}
	}
	$scope.update(bill)
	$http.post("api/bill/" , bill);
	upDebt(bill)	
	}
	else{
		alert("facture vide")
	}
}

}]);
