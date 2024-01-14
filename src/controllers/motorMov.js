// Función para realizar un movimiento con un servo y esperar un tiempo antes de volver a la posición inicial
export const realizarMovimiento = (servo, angulo, duracion) => {
  // Verificar si se proporcionó un objeto servo válido
  if (servo) {
    // Mover el servo al ángulo especificado
    servo.to(angulo);

    // Devolver una promesa que se resolverá después de la duración especificada
    return new Promise((resolve) => {
      setTimeout(() => {
        // Volver el servo a la posición inicial (ángulo 0) después del tiempo de espera
        servo.to(0);

        // Resolver la promesa indicando que el movimiento ha sido completado
        resolve();
      }, duracion);
    });
  } else {
    // Imprimir un mensaje de error si no se proporciona un objeto servo válido
    console.log("Error del servo: El objeto servo no está definido");
  }
};
