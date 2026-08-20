import { logger } from "../../funciones/utilerias/logger.js";
import { getClient } from "../../configuraciones/config.db.js";
import { selColumnsDescByBot, selColumnsDesc, selColumnsDescPaguinado,ftSearchTerm,ftType,ftStartDate,ftEndDate,ftOffsetDes } from './listaquery.js'

export const getDescuent10 = async function () {
    let descuen;
    try {
      descuen = await getClient();
  
      const query = `SELECT nombre, descripcion, tipo_descuento, valor, codigo
      FROM orders_bot.descuentos
      WHERE CAST(valor AS NUMERIC) > 10;`;
  
      const resultado = await descuen.query(query);
      descuen.release();
  
      return resultado.rows.length > 0 ? resultado.rows : [false];
    } catch (err) {
      if (descuen) descuen.release();
      logger.debug(err);
      return err;
    }
  };