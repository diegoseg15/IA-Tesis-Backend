// Función para realizar un movimiento y esperar un tiempo antes de volver a la posición inicial
export const realizarMovimiento = (servo, angulo, duracion) => {
  if (servo) {
    servo.to(angulo);
    return new Promise((resolve) => {
      setTimeout(() => {
        servo.to(0);
        resolve();
      }, duracion);
    });
  } else {
    console.log("error del servo");
  }
};
