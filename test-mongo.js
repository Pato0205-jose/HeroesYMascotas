import mongoose from 'mongoose';

const uri = 'mongodb+srv://acanche044:acanche044@cluster0.oslxqpy.mongodb.net/superheroes?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
  .then(() => {
    console.log('¡Conexión exitosa!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error de conexión:', err);
    process.exit(1);
  }); 