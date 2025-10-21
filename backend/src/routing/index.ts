import {Router, Request, Response} from "express"
import { compile } from "morgan"
import {users, IUser} from "../models/User"
import { body, Result, ValidationError, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv';
import { validateToken } from "../middleware/validateToken"
import {ICourse, courses} from "../models/Courses"
dotenv.config();


const router: Router = Router()


router.post("/api/register", async (req: Request, res: Response) => {
    console.log("SHIT CALLED :)");
    console.log(req.body);
    
    
            try {
                let email:string = req.body.email
                let foundUser = await users.findOne({ email: email })
                console.log(foundUser);
                
                if (foundUser) {
                    res.status(403).json({email: "Email already in use"})
                } else {
                    const salt: string = bcrypt.genSaltSync(10)
                    const hash: string = bcrypt.hashSync(req.body.password, salt)
                        
                    let newUser:IUser = new users ({
                        email: req.body.email,
                        password: hash,
                        imageId: null
                    })
                    await newUser.save()
                    res.status(200).json(newUser)
                    console.log(newUser);
            }
                
        } catch (error: any) {
            console.error(`Error during registeration: ${error}`)
            res.status(500).json({error : "Internal server error"})
        }
    }
)

router.post("/api/login", //logValidator,
    async (req: Request, res: Response) => {
        try {
            let email:string = req.body.email
            const foundUser = await users.findOne({ email: email })
            
            if (foundUser) {
                if (bcrypt.compareSync(req.body.password, foundUser.password)){
                    const JwtPayload: JwtPayload = {
                        _id: foundUser._id,
                    }
                    const token: string = jwt.sign(JwtPayload, process.env.SECRET as string, {expiresIn: "30m"})
                    res.status(200).json({success: true, token})
                } else {
                    res.status(401).json({message: "Login failed"})
                }
            } else { 
                res.status(401).json({ message: "Login failed"})
            }

        } catch (error: any) {
            console.error(`Error during registeration: ${error}`)
            res.status(500).json({error : "Internal server error"})
        }
})

router.post('/api/addLike', validateToken, async (req: any, res: any) => {
    try {
        const user = req.user;

        if (!user) {
            console.log("User not found or token invalid");
            res.status(401).json({ message: 'Access denied.' });
        }

        const foundUser = await users.findOne({ _id: user._id });
        if (!foundUser) {
            res.status(404).json({ message: 'User not found.' });
        }

        console.log("Request body:", req.body);

        const updatedCourse = await courses.updateOne(
            { _id: req.body.id },
            { $inc: { likes: 1 } }
        );

        if (updatedCourse.modifiedCount === 0) {
            res.status(404).json({ message: 'Course not found or not updated.' });
        }

        res.status(200).json({ message: "Like added successfully." });

    } catch (error) {
        console.error('Error adding like:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/api/addDisLike', validateToken, async (req: any, res: any) => {
    try {
        const user = req.user;

        if (!user) {
            console.log("User not found or token invalid");
            res.status(401).json({ message: 'Access denied.' });
        }

        const foundUser = await users.findOne({ _id: user._id });
        if (!foundUser) {
            res.status(404).json({ message: 'User not found.' });
        }

        console.log("Request body:", req.body);

        const updatedCourse = await courses.updateOne(
            { _id: req.body.id },
            { $inc: { Dislikes: 1 } }
        );

        if (updatedCourse.modifiedCount === 0) {
            res.status(404).json({ message: 'Course not found or not updated.' });
        }

        res.status(200).json({ message: "Dislike added successfully." });

    } catch (error) {
        console.error('Error adding like:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get("/api/getCourses", validateToken, async (req: any, res: Response) => {
    try {
        const user = req.user
        console.log(user);
        
        let courseList: ICourse[] = await courses.find()
        
        res.json({courseList})
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Error"})
      }
})



export default router

