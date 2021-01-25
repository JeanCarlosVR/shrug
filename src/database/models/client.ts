const clientSchemaModel = new (require("mongoose")).Schema({
    id: {
        type: String,
        required: true,
        default: "741539390140055622"
    },
    data: {
        type: Object,
        required: true,
        default: {}
    },
});

export = (require("mongoose")).model("client", clientSchemaModel);