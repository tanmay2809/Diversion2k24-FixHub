const Service = require('../models/serviceSchema');

exports.postServiceController = async(req,res) => {
    try{
        const {tid,sid,question,fare} = req.body;

        const response = await Service.create({tid,sid,question,fare});
        const populatedResponse = await Service.findById(response._id).populate("tid").populate("sid").exec();
        res.status(201).json({
            success:true,
            response,
            populatedResponse,
        });

    }
    catch(err){
        res.status(500).json(
            {
                success:false,
                data:"failed to post details",
                message:err.message
            }
        )
    }
};

exports.getServiceControllerUser = async(req,res) => {
    try{
        const id = req.params.id;
        const data = await Service.find({sid:id});
        if(!data)
        {
            return res.status(404).json(
                {
                    success:false,
                    message : "No data found",
                }
            )
        }
        else{
            res.status(200).json(
                {
                    success:true,
                    data:data,
                    message:"entry fetched"
                }
            )
        }
    }
    catch(err){
        res.status(500).json(
            {
                success:false,
                data:"fetch failed",
                message:err.message
            }
        )
    }
};


exports.getServiceControllerHandymen = async(req,res) => {
    try{
        const id = req.params.id;
        const data = await Service.find({tid:id});
        if(!data)
        {
            return res.status(404).json(
                {
                    success:false,
                    message : "No data found",
                }
            )
        }
        else{
            res.status(200).json(
                {
                    success:true,
                    data:data,
                    message:"entry fetched"
                }
            )
        }
    }
    catch(err){
        res.status(500).json(
            {
                success:false,
                data:"fetch failed",
                message:err.message
            }
        )
    }
};