const express = require('express');
const multer = require('multer');
const fs = require('fs');
const Sauce = require('../models/sauce');

exports.addOneSauce = (req, res, next)=>{
    const sauceNew = JSON.parse(req.body.sauce);
    delete sauceNew._id;
    delete sauceNew._userId;
    const sauce = new Sauce({
        ...sauceNew,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked:[],
        usersDisliked:[],
    });

    sauce.save()
        .then(()=> {res.status(201).json({message : 'objet enregistré !'})})
        .catch(error=>{res.status(400).json({error})})
};

exports.getAllSauces = (req, res, next) =>{
    Sauce.find()
        .then(sauces=> res.status(200).json(sauces))
        .catch(error=> res.status(400).json({error}));
};

exports.getOneSauce = (req,res,next)=>{
    Sauce.findOne({_id: req.params.id})
        .then(sauce =>res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}))
};

exports.updateOneSauce = (req, res, next)=>{
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

    delete sauceObject._userId;
    Sauce.findOne({_id:req.params.id})
        .then((sauce)=>{
            if(sauce.userId != req.auth.userId){
                res.status(401).json({message: "non-authorisé"})
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, ()=>{
                Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                    .then(()=>res.status(200).json({message: "Sauce modifié"}))
                    .catch(error=> res.status(401).json({error}));
                });
            }
        })
        .catch(error=> res.status(400).json({error}))
};

exports.deleteOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce)=>{
            if(sauce.userId != req.auth.userId){
                res.status(401).json({message: "non-authorisé"})
            } else{
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, ()=>{
                    Sauce.deleteOne({_id: req.params.id})
                        .then(()=>{res.status(200).json({message: 'Sauce supprimé'})})
                        .catch(error=>res.status(401).json({error}));
                });
            }
        })
        .catch(error=>{res.status(500).json({error})
    });
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({_id:req.params.id})
        .then((sauce)=>{
            let likeStatus = req.body.like;
            let alreadyLiked = sauce.usersLiked.includes(req.auth.userId);
            let alreadyDisliked = sauce.usersDisliked.includes(req.auth.userId);

            //Check for likeStatus, add one like and dismiss the dislikes if needed, do nothing if already liked
            if(likeStatus===1){
                if (alreadyLiked == true){
                    res.status(200).json({message: "you already liked this sauce"})
                }
                if(alreadyDisliked == true){
                    Sauce.updateOne({_id:req.params.id},{$inc:{likes:+1},$inc:{dislikes:-1}, $push:{usersLiked:req.auth.userId}, $pull:{usersDisliked: res.auth.userId}})
                        .then(()=>res.status(201).json({message: "Likes +1"}))
                        .catch(error => res.status(400).json({error}))
                } 
                else{
                    Sauce.updateOne({_id:req.params.id},{$inc:{likes:+1}, $push:{usersLiked: req.auth.userId}})
                        .then(()=>res.status(201).json({message: "You liked"}))
                        .catch(error => res.status(400).json({error}))
                }
            }

            //Check for likeStatus, return to neutral state, dismissing either likes or dislikes
            if(likeStatus===0){
                if(alreadyLiked == true){
                    Sauce.updateOne({_id:req.params.id},{$inc:{likes:-1}, $pull:{usersLiked: req.auth.userId}})
                        .then(()=>res.status(201).json({message: "Neutral state returned"}))
                        .catch(error => res.status(400).json({error}))
                }
                if(alreadyDisliked ==true){
                        Sauce.updateOne({_id:req.params.id},{$inc:{dislikes:-1}, $pull:{usersDisliked: req.auth.userId}})
                        .then(()=>res.status(201).json({message: "Neutral state returned"}))
                        .catch(error => res.status(400).json({error}))
                }
            }

            //Check for likeStatus, add one dislike and dismiss the like if needed, do nothing if already disliked
            if(likeStatus === -1){
                if (alreadyDisliked == true){
                    res.status(200).json({message: "you already disliked this sauce"})
                }
                if(alreadyDisliked == true){
                    Sauce.updateOne({_id:req.params.id},{$inc:{likes:11},$inc:{dislikes:+1}, $pull:{usersLiked:req.auth.userId}, $push:{usersDisliked: req.auth.userId}})
                        .then(()=>res.status(201).json({message: "You disliked"}))
                        .catch(error => res.status(400).json({error}))
                }
                else{
                    Sauce.updateOne({_id:req.params.id},{$inc:{dislikes:+1}, $push:{usersDisliked: req.auth.userId}})
                        .then(()=>res.status(201).json({message: "You disliked"}))
                        .catch(error => res.status(400).json({error}))
                }
            }
        })
        .catch(error=>res.status(500).json({error}))
};
