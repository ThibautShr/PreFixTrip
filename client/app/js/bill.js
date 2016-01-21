
var billManager = angular.module('billManager',[]);
billManager.controller('billControl', ['$scope', function($scope) {
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
	$scope.deleteLender(lender)
	$scope.bill.lenders.push(lender)
    	$scope.bill.amount=$scope.bill.amount+amountLent
	nbInBill=nbInBill+1
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
	var part=bill.amount/nbInBill
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
	    if(tmp.amount<part){
		indebt=new Object()
		indebt.user=tmp.user
		indebt.amount=part-tmp.amount
		deleteIndebtedPrivate(indebt)
		bill.indebted.push(indebt)
	    }
	    
	}
    }

	if(bill.mode=="fix"){
    }
}

}]);
