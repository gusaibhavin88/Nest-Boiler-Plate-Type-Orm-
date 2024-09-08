import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    fieldsToSplit = ['designExpertise', 'languageSpoken', 'designTools'];
    fieldsToArrayOfObjects = [
        'education',
        'awards',
        'affiliations',
        'questions',
        'sustainabilityPreferences',
        'serviceOffered',
        'designStyle',
    ];

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        req.body = this.transformRequestBody(req.body);
        return next.handle();
    }

    private transformRequestBody(body: any): any {
        const parseJsonStrings = (data: any) => {
            for (const key in data) {
                if (typeof data[key] === 'string') {
                    try {
                        const parsedValue = JSON.parse(data[key]);
                        if (!isNaN(parsedValue)) {
                            data[key] = parsedValue;
                        } else {
                            data[key] = parsedValue;
                        }
                    } catch (error) {
                        // Ignore parsing errors, leave the value as is
                    }
                } else if (typeof data[key] === 'object') {
                    parseJsonStrings(data[key]);
                }
            }
        };

        const stringifyNumbers = (data: any) => {
            for (const key in data) {
                if (typeof data[key] === 'number') {
                    data[key] = data[key].toString();
                } else if (typeof data[key] === 'object') {
                    stringifyNumbers(data[key]);
                }
            }
        };

        parseJsonStrings(body);
        stringifyNumbers(body);

        // Iterate through fields that need to be split
        for (const key of this.fieldsToSplit) {
            if (typeof body[key] === 'string') {
                if (body[key].length === 0) {
                    // If the string is empty, assign an empty array
                    body[key] = [];
                } else {
                    // Otherwise, split the string
                    body[key] = body[key].split(',');
                }
            }
        }

        if (body && this.fieldsToArrayOfObjects.some((key) => Object.keys(body).includes(key))) {
            // Transform fields to arrays of objects
            for (const key of this.fieldsToArrayOfObjects) {
                if (Array.isArray(body[key])) {
                    // If the field is already an array, leave it as is
                    continue;
                } else if (typeof body[key] === 'string') {
                    try {
                        if (body[key].length === 0) {
                            // If the string is empty, assign an empty array
                            body[key] = [];
                        }
                        // Parse the string representation of objects into an array of objects
                        const objectsArray: any[] = body[key]
                            .split('},{')
                            .map((objString: string, index: number, array: string[]) => {
                                // Add braces to the first and last objects if needed
                                if (index === 0) {
                                    return JSON.parse(objString + '}');
                                } else if (index === array.length - 1) {
                                    return JSON.parse('{' + objString);
                                } else {
                                    return JSON.parse('{' + objString + '}');
                                }
                            });
                        // Assign the array of objects to the field
                        body[key] = objectsArray;
                    } catch (error) {
                        // Ignore parsing errors, leave the value as is
                    }
                } else if (typeof body[key] === 'object' && body[key] !== null) {
                    // If the value is an object, store it as an array containing that object
                    body[key] = [body[key]];
                } else {
                    if (!Object.keys(body).includes(key)) {
                        continue;
                    } else {
                        body[key] = [];
                    }
                }
            }
        }

        return body;
    }
}
