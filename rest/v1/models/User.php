<?php if(!defined('SPECIALCONSTANT')) die(json_encode([array('id'=>'0','error'=>'Acceso Denegado')]));

$app->get('/user/:id',function($id) use($app) {
	try {
		//sleep(1);
		if( isset( $id ) ){
			$pag = $id;
		}else{
			$pag = 1;
		}
		$res = get_todo_paginado( 'user', $pag );

		$app->response->headers->set('Content-type','application/json');
		$app->response->headers->set('Access-Control-Allow-Origin','*');
		$app->response->status(200);
		$app->response->body(json_encode($res));
	}catch(PDOException $e) {
		echo 'Error: '.$e->getMessage();
	}
});

$app->post("/user/",function() use($app) {
	try {
		$postdata = file_get_contents("php://input");

		$request = json_decode($postdata);
		$request = (array) $request;
		$conex = getConex();
		$res = array( 'error'=>'yes', 'msj'=>'Puta no se pudo hacer nada, revisa mierda.' );

		if( isset( $request['id'] )  ){  // ACTUALIZAR

			$sql = "UPDATE user 
						SET
							ci            = '". $request['ci'] ."',
							ex            = '". $request['ex'] ."',
							name          = '". $request['name'] ."',
							last_name     = '". $request['last_name'] ."',
							email  		  = '". $request['email'] ."',
							pwd 	   	  = '". $request['pwd'] ."',
							type          = '". $request['type'] ."'
					WHERE id=" . $request['id'].";";

			$hecho = $conex->prepare( $sql );
			$hecho->execute();
			$conex = null;
			
			$res = array( 'id'=>$request['id'], 'error'=>'not', 'msj'=>'Usuario actualizado.' );

		}else{  // INSERT

			$salt = '#/$02.06$/#_#/$25.10$/#';
			$pwd = md5($salt.$request['pwd']);
			$pwd = sha1($salt.$pwd);

			$sql = "CALL pInsertUser(
						'". $request['ci'] . "',
						'". $request['ex'] . "',
						'". $request['name'] . "',
						'". $request['last_name'] . "',
						'". $request['email'] . "',
						'". $pwd . "',
						'". $request['type'] . "' );";

			$hecho = $conex->prepare( $sql );
			$hecho->execute();
			$conex = null;

			$res = $hecho->fetchObject();

		}

		$app->response->headers->set('Content-type','application/json');
		$app->response->status(200);
		$app->response->body(json_encode($res));

	}catch(PDOException $e) {
		echo "Error: ".$e->getMessage();
	}
});

$app->delete('/user/:id',function($id) use($app) {
	try {
		$conex = getConex();
		$result = $conex->prepare("DELETE FROM user WHERE id='$id'");

		$result->execute();
		$conex = null;

		$app->response->headers->set('Content-type','application/json');
		$app->response->status(200);
		$app->response->body(json_encode(array('id'=>$id,'error'=>'not','msj'=>'Registro eliminado correctamente.')));

	} catch(PDOException $e) {
		echo 'Error: '.$e->getMessage();
	}
})->conditions(array('id'=>'[0-9]{1,11}'));


$app->post("/login/",function() use($app) {
	$objDatos = json_decode(file_get_contents("php://input"));

	$correo = $objDatos->email;
	$contra = $objDatos->pwd;
	//sleep(3);

	try {
		$conex = getConex();

		$salt = '#/$02.06$/#_#/$25.10$/#';
		$contra = md5($salt.$contra);
		$contra = sha1($salt.$contra);

		$result = $conex->prepare("CALL pSession('$correo','$contra');");

		$result->execute();
		$res = $result->fetchObject();
		if($res->error == 'not'){
			$_SESSION['uid'] = uniqid('ang_');
		}

		$conex = null;

		$app->response->headers->set("Content-type","application/json");
		$app->response->headers->set('Access-Control-Allow-Origin','*');
		$app->response->status(200);
		$app->response->body(json_encode($res));

	}catch(PDOException $e) {
		echo "Error: ".$e->getMessage();
	}
});
