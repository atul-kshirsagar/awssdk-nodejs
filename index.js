const { response } = require('express');

exp = require('express');
aws = require('aws-sdk');

aws.config.update({region: 'us-east-1'});
ec2 = new aws.EC2();

p1 = {
    Filters : [
        {
            Name : 'instance-state-name',
            Values: ['running','stopped']
        }
    ]
};

app = exp(); //create an app

//Home Page
app.get('/',(req,res)=>{
    // res.send("<h1 align='center'> Welcome to home page of application </h1>");
    res.sendFile('index.html',{root:'.'});
});

//Images Path
app.get('/images',(req,res)=>{
    res.send("<h1 align='center'> You are in images path. you can download images now!😊</h1>");
});

//Videos Path
app.get('/videos',(req,res)=>{
    res.send("<h1 align='center'> You are in Videos path. you can watch videos now!😎</h1>");
});

//Launch Instance 
app.get('/launchinstance',(req,res)=>{
    params = {
        ImageId : 'ami-05fa00d4c63e32376',
        MinCount : 1,
        MaxCount : 1,
        InstanceType : 't2.micro',
        SecurityGroups : ['MysecurityGroup'],
        KeyName : 'Mykeypair'
    };
    ec2.runInstances(params,function(err,data){
        if(err){
            console.log("There is some error",err);
            res.send("There is an error in launching an instance");
        }
        else{
            console.log("Instance launched successfully",data);
            res.send("The instance has been launched successfully.");
        }
    })
})

//List All Instances
app.get('/listinstances',function(req,res){

    p2 = { 
        Filters : [
        {
            Name : 'instance-state-name',
            Values: ['running', 'stopped']
        }
    ]};
    ec2.describeInstances(p2,function(err,data){
        if(err){
            console.log("There is some error",err);
        }
        else{
            res.send("You can see output on terminal.");
            console.log("\n\nInstance are : ",data);
            for(var i=0; i< data.Reservations.length;i++)
            {
                for(var j=0;j<data.Reservations[i].Instances.length;j++)
                {
                    console.log("The Instance ID is : ",data.Reservations[i].Instances[j].InstanceId); 
                    console.log("The Instance State : ",data.Reservations[i].Instances[j].InstanceState); 
                    console.log("The Instance Type is : ",data.Reservations[i].Instances[j].InstanceType); 
                    console.log("The ImageId is : ",data.Reservations[i].Instances[j].ImageId);
                    console.log("The KeyPair is : ",data.Reservations[i].Instances[j].KeyName);         
                    console.log("The Security Group is : ",data.Reservations[i].Instances[j].SecurityGroups);
                    console.log("======================================================================\n");       
                }    
            }
            
        }
    })
})

//List Specific Instances
app.get('/listSpecificInstance',function(req,res){

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question('Enter Instance Id : ', instance_id => {
        console.log(`Instance Id passed is: ${instance_id}`);
        var params = {};
        params.InstanceIds = [];
        params.InstanceIds.push(instance_id);
        readline.close();
        console.log("The params array is : ",params);

        ec2.describeInstances(params,function(err,data){
            if(err){
                console.log("There is some error",err);
            }
            else{
                res.send("You can see output on terminal.");
                console.log("Instance details are : ");
                for(var i=0; i< data.Reservations.length;i++)
                {
                    for(var j=0;j<data.Reservations[i].Instances.length;j++)
                    {
                        console.log("The Instance ID is : ",data.Reservations[i].Instances[j].InstanceId); 
                        console.log("The Instance Type is : ",data.Reservations[i].Instances[j].InstanceType); 
                        console.log("The ImageId is : ",data.Reservations[i].Instances[j].ImageId);
                        console.log("The KeyPair is : ",data.Reservations[i].Instances[j].KeyName);         
                        console.log("The Security Group is : ",data.Reservations[i].Instances[j].SecurityGroups);
                        console.log("======================================================================\n");         
                    }    
                }
                
            }
        })
      });
})

//Stop All Instances
app.get('/stopinstances',function(req,res){

    p3 = {
    Filters : [
        {
            Name : 'instance-state-name',
            Values: ['running']
        }
    ]
};
    ec2.describeInstances(p3,function(err,data){
        if(err){
            console.log("There is some error",err);
        }
        else{
            var params = {};
            params.InstanceIds = [];

            console.log("Instance running are : ",data);
            for(var i=0; i< data.Reservations.length;i++)
            {
                for(var j=0;j<data.Reservations[i].Instances.length;j++)
                {
                    console.log("The Instance ID is : ",data.Reservations[i].Instances[j].InstanceId);        
                    var instance_id = data.Reservations[i].Instances[j].InstanceId;
                    params.InstanceIds.push(instance_id);
                }    
            }

            ec2.stopInstances(params,function(err,data){
                if(err){
                    console.log("Error in stopping instances :");
                    res.send("Error in stopping instances :");
                }
                else{
                    console.log("Stopped instances successfully:");
                    res.send("Stopped instances successfully:");   
                }
            })
        }
    })
})

//Stop Specific Instance
app.get('/StopSpecificInstance',function(req,res){
    
    var instance_id = req.query.instanceId;
    console.log("Instance Id Passed is : ",instance_id);

    var params = {};
    params.InstanceIds = [];
    params.InstanceIds.push(instance_id);

    console.log("The params array is : ",params);

    ec2.stopInstances(params,function(err,data){
        if(err){
            console.log("Error in stopping instances :");
            res.send("Error in stopping instances :");
        }
        else{
            console.log("Stopped instances successfully:");
            res.send("Stopped instances successfully:");   
        }
    })
})

//Terminate All Instances
app.get('/terminateinstances',function(req,res){

    p4 = {
    Filters : [
        {
            Name : 'instance-state-name',
            Values: ['running','stopped']
        }
    ]
};
    ec2.describeInstances(p4,function(err,data){
        if(err){
            console.log("There is some error",err);
        }
        else{
            var params = {};
            params.InstanceIds = [];

            console.log("Instance running/stopped are : ",data);
            for(var i=0; i< data.Reservations.length;i++)
            {
                for(var j=0;j<data.Reservations[i].Instances.length;j++)
                {
                    console.log("The Instance ID is : ",data.Reservations[i].Instances[j].InstanceId);        
                    var instance_id = data.Reservations[i].Instances[j].InstanceId;
                    params.InstanceIds.push(instance_id);
                }    
            }

            ec2.terminateInstances(params,function(err,data){
                if(err){
                    console.log("Error in terminating instances :");
                    res.send("Error in terminating instances :");
                }
                else{
                    console.log("Terminated instances successfully:");
                    res.send("Terminated instances successfully:");   
                }
            })
            console.log("Params array is :",params);
        }
    })
})

//Terminate Specific Instance
app.get('/TerminateSpecificInstance',function(req,res){
    
    var instance_id = req.query.instanceId;
    console.log("Instance Id Passed is : ",instance_id);

    var params = {};
    params.InstanceIds = [];
    params.InstanceIds.push(instance_id);

    console.log("The params array is : ",params);

    ec2.describeInstances(params,function(err,data){
        if(err){
            console.log("There is some error",err);
        }
        else{
            var params = {};
            params.InstanceIds = [];

            console.log("Instance running/stopped are : ",data);
            for(var i=0; i< data.Reservations.length;i++)
            {
                for(var j=0;j<data.Reservations[i].Instances.length;j++)
                {
                    console.log("The Instance ID is : ",data.Reservations[i].Instances[j].InstanceId);        
                    var instance_id = data.Reservations[i].Instances[j].InstanceId;
                    params.InstanceIds.push(instance_id);
                }    
            }

            ec2.terminateInstances(params,function(err,data){
                if(err){
                    console.log("Error in terminating instances :");
                    res.send("Error in terminating instances :");
                }
                else{
                    console.log("Terminated instances successfully:");
                    res.send("Terminated instances successfully:");   
                }
            })
        }
    })
})

//Start All Instances
app.get('/startinstances',function(req,res){

    p5 = {
    Filters : [
        {
            Name : 'instance-state-name',
            Values: ['stopped']
        }
    ]
};
    ec2.describeInstances(p5,function(err,data){
        if(err){
            console.log("There is some error",err);
        }
        else{
            var params = {};
            params.InstanceIds = [];

            console.log("Instance running are : ",data);
            for(var i=0; i< data.Reservations.length;i++)
            {
                for(var j=0;j<data.Reservations[i].Instances.length;j++)
                {
                    console.log("The Instance ID is : ",data.Reservations[i].Instances[j].InstanceId);        
                    var instance_id = data.Reservations[i].Instances[j].InstanceId;
                    params.InstanceIds.push(instance_id);
                }    
            }

            ec2.startInstances(params,function(err,data){
                if(err){
                    console.log("Error in starting instances :");
                    res.send("Error in starting instances :");
                }
                else{
                    console.log("Started instances successfully:");
                    res.send("Started instances successfully:");   
                }
            })
            console.log("Params array is :",params);
            
        }
    })
})

//Start Specific Instance
app.get('/StartSpecificInstance',function(req,res){
    
    var instance_id = req.query.instanceId;
    console.log("Instance Id Passed is : ",instance_id);

    var params = {};
    params.InstanceIds = [];
    params.InstanceIds.push(instance_id);

    console.log("The params array is : ",params);

    ec2.describeInstances(params,function(err,data){
        if(err){
            console.log("There is some error",err);
        }
        else{
            var params = {};
            params.InstanceIds = [];

            console.log("Instance running/stopped are : ",data);
            for(var i=0; i< data.Reservations.length;i++)
            {
                for(var j=0;j<data.Reservations[i].Instances.length;j++)
                {
                    console.log("The Instance ID is : ",data.Reservations[i].Instances[j].InstanceId);        
                    var instance_id = data.Reservations[i].Instances[j].InstanceId;
                    params.InstanceIds.push(instance_id);
                }    
            }

            ec2.startInstances(params,function(err,data){
                if(err){
                    console.log("Error in starting instances :");
                    res.send("Error in starting instances :");
                }
                else{
                    console.log("Started instances successfully:");
                    res.send("Started instances successfully:");   
                }
            })
        }
    })
})

//listen,portno
app.listen(3500,()=>{
    console.log("Server started listening on port 3500");
})