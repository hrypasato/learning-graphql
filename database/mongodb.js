// use azdev

db.crateCollection("approachDetails",{
    validator:{
        $jsonSchema:{
            bsonType: "object",
            required: ["pgId"],
            properties:{
                pgId:{
                    bsonType:"int",
                    description:"must be an integer and is required"
                }
            }
        }
    }
})