<?php
	require_once __DIR__ . "./../AjaxResponse.php";
	include DIR_DB_UTIL . "sessionUtil.php";
	
	$response = new AjaxResponse();

	if( !array_key_exists("type", $_POST) || !array_key_exists("value", $_POST) 
		|| ( $_POST["type"] != "username" && $_POST["type"] != "email") ) //Verifico se la validità dei dati inviati
		$response->error("Richiesta rifiutata");

	$count = checkUnique($_POST["type"], $_POST["value"]);

	if($count === false)
		$response->error("Richiesta rifiutata");
	else
		$response->sendBack(0, "Ok", $count);	
?>