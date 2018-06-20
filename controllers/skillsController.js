'use strict';
const Skill = require( '../models/skill' );
console.log("loading the skills Controller")


// this displays all of the skills
exports.getAllSkills = ( req, res ) => {
  console.log('in getAllSkills')
  Skill.find( {} )
    .exec()
    .then( ( skills ) => {
      res.render( 'skills', {
        skills: skills
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'skill promise complete' );
    } );
};




exports.saveSkill = ( req, res ) => {
  console.log("in saveSkill!")
  console.dir(req)
  let newSkill = new Skill( {
    name: req.body.name,
    description: req.body.description
  } )

  console.log("skill = "+newSkill)

  newSkill.save()
    .then( () => {
      res.redirect( '/skills' );
    } )
    .catch( error => {
      res.send( error );
    } );
};

exports.deleteSkill = (req, res) => {
  console.log("in deleteSkill")
  let skillName = req.body.deleteName
  if (typeof(skillName)=='string') {
      Skill.deleteOne({name:skillName})
           .exec()
           .then(()=>{res.redirect('/skills')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(skillName)=='object'){ //if it's a list
      Skill.deleteMany({name:{$in:skillName}})
           .exec()
           .then(()=>{res.redirect('/skills')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(skillName)=='undefined'){
      console.log("This is if they didn't select a skill")
      res.redirect('/skills')
  } else {
    console.log("This shouldn't happen!")
    res.send(`unknown skillName: ${skillName}`)
  }

};
