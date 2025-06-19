const { Schema, model, Types } = require('mongoose');

const PlanSchema = new Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    duracionMeses: { type: Number, required: true },
    categoriasPermitidas: [{ type: Types.ObjectId, ref: 'Categoria' }],
  },
  { timestamps: true }
);

module.exports = model('Plan', PlanSchema);
