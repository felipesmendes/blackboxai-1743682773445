import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'pontos',
      columns: [
        { name: 'motorista_id', type: 'string' },
        { name: 'veiculo_id', type: 'string' },
        { name: 'data_hora', type: 'number' },
        { name: 'data_hora_fim', type: 'number', isOptional: true },
        { name: 'tempo', type: 'number' },
        { name: 'tipo', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'synced', type: 'boolean' },
      ],
    }),
  ],
});