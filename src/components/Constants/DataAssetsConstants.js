export const BOOLEAN_VALUES = [
    { name: 'True', value: 'true' },
    { name: 'False', value: 'false' }
];
//csv, parquet, xml, json
export const FILE_TYPE = [
    { name: 'CSV', value: 'csv' },
    { name: 'Parquet', value: 'parquet' },
    // { name: 'XML', value: 'xml' },
    { name: 'ORC', value: 'orc' },
    { name: 'JSON', value: 'json' }
]

//Integer,Long,Double,String,Boolean,Datetime
export const TARGET_DATA_TYPE = [
    { name: 'Boolean', value: 'Boolean' },
    { name: 'Datetime', value: 'Datetime' },
    { name: 'Double', value: 'Double' },
    { name: 'Integer', value: 'Integer' },
    { name: 'Long', value: 'Long' },
    { name: 'String', value: 'String' },  
]

export const DATA_TYPES = [
    {
        name: 'Boolean', value: 'Boolean',
        targetDataType: [{ name: 'Boolean', value: 'Boolean' }]
    },
    {
        name: 'Datetime', value: 'Datetime',
        targetDataType: [
            { name: 'Datetime', value: 'Datetime' },
            { name: 'String', value: 'String' }]
    },
    {
        name: 'Double', value: 'Double',
        targetDataType: [
            { name: 'Double', value: 'Double' },
            { name: 'String', value: 'String' }]
    },
    {
        name: 'Integer', value: 'Integer',
        targetDataType: [
            { name: 'Integer', value: 'Integer' },
            { name: 'Long', value: 'Long' },
            { name: 'Double', value: 'Double' },
            { name: 'String', value: 'String' }]
    },
    {
        name: 'Long', value: 'Long',
        targetDataType: [
            { name: 'Long', value: 'Long' },
            { name: 'Double', value: 'Double' },
            { name: 'String', value: 'String' }]
    },
    {
        name: 'String', value: 'String',
        targetDataType: [{ name: 'String', value: 'String' }]
    },
];

export const DATA_CLASSIFICATION = [
    { name: 'Public', value: 'public' },
    { name: 'Internal', value: 'internal' },
    { name: 'Confidential', value: 'confidential' },
    { name: 'Restricted', value: 'restricted' }
]

export const TRIGGER_MECHANISM = [
    { name: 'Time Driven', value: 'time_driven' },
    { name: 'Event Driven', value: 'event_driven' },
]

export const DATE_TIME_FORMATS = [
    { name: 'MM/dd/yyyy', value: 'MM/dd/yyyy' },
    { name: 'MM/dd/yy', value: 'MM/dd/yy' },
    { name: 'dd/MM/yyyy', value: 'dd/MM/yyyy' },
    { name: 'dd/MM/yy', value: 'dd/MM/yy' },
    { name: 'dd-MM-yyyy', value: 'dd-MM-yyyy' },
    { name: 'dd-MM-yy', value: 'dd-MM-yy' },
    { name: 'MM-dd-yyyy', value: 'MM-dd-yyyy' },
    { name: 'MM-dd-yy', value: 'MM-dd-yy' },
    { name: 'yyyy-MM-dd', value: 'yyyy-MM-dd' },
    { name: 'yyyy-MM-dd hh:mm:ss', value: 'yyyy-MM-dd hh:mm:ss' },
    { name: 'yyyy-MM-dd HH:mm:ss', value: 'yyyy-MM-dd HH:mm:ss'},
    { name: 'yyyy-MM-dd hh:mm:ss tt', value: 'yyyy-MM-dd hh:mm:ss tt' },
    { name : 'Custom', value: 'custom'}
]