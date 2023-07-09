const ssoLoginSchema = {
    createUser: {
        path: '/v1/register',
        method: 'post',
        summary: 'Create user',
        description: 'Create a new user account',
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            email: { type: 'string' },
                            first_name: { type: 'string' },
                            last_name: { type: 'string' },
                            password: { type: 'string' }
                        },
                        required: ['email', 'first_name', 'last_name', 'password']
                    }
                }
            }
        },
        responses: {
            '201': {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                status: { type: 'string' },
                                data: {
                                    type: 'object',
                                    properties: {
                                        email: { type: 'string' },
                                        first_name: { type: 'string' },
                                        last_name: { type: 'string' },
                                        created_on: { type: 'string' },
                                        token: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '400': {
                description: 'Bad Request',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                error: { type: 'string' }
                            }
                        }
                    }
                }
            },
            '500': {
                description: 'Internal Server Error',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                error: { type: 'string' }
                            }
                        }
                    }
                }
            }
        },
        tags: ['User Management']
    },
    siginUser: {
        path: '/v1/login',
        method: 'post',
        summary: 'Login user',
        description: 'Authenticate user and generate token',
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            email: {
                                type: 'string',
                                description: 'User email',
                                example: 'user@example.com',
                            },
                            password: {
                                type: 'string',
                                description: 'User password',
                                example: 'password123',
                            },
                        },
                        required: ['email', 'password'],
                    },
                },
            },
        },
        responses: {
            '200': {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    properties: {
                                        user: {
                                            type: 'object',
                                            properties: {
                                                // Define the properties of the user object here
                                                // (e.g., email, id, is_admin, first_name, last_name)
                                            },
                                        },
                                        token: {
                                            type: 'string',
                                            description: 'Authentication token',
                                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpZCI6MSwiaXNfYWRtaW4iOmZhbHNlLCJmaXJzdF9uYW1lIjoiVXNlciIsImxhc3RfbmFtZSI6Ik5hbWUiLCJpYXQiOjE2MzE3MzEwMDR9.-MbqUE5h8uN4j1nmxkexva1ZS4wSZM9Qz_JMi0BL8Q0',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            // Define other possible response codes and descriptions here
        },
        tags: ['User Management']
    },
    getAllUser: {
        path: '/v1/fetch-all-users',
        method: 'get',
        summary: 'Fetch all users',
        description: 'Retrieve all registered users',
        responses: {
            '200': {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            userName: {
                                                type: 'string',
                                            },
                                            email: {
                                                type: 'string',
                                            },
                                            requestedDate: {
                                                type: 'string',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            // Define other possible response codes and descriptions here
        },
        tags: ['User Management']
    },
    deleteUser: {
        path: '/v1/delete',
        method: 'post',
        summary: 'Delete user',
        description: 'Delete an existing user',
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            email: {
                                type: 'string',
                                description: 'Email of the user to be deleted',
                                example: 'user@example.com'
                            }
                        },
                        required: ['email']
                    }
                }
            }
        },
        responses: {
            '200': {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                message: {
                                    type: 'string',
                                    description: 'Success message',
                                    example: 'User deleted successfully'
                                }
                            }
                        }
                    }
                }
            },
            '400': {
                description: 'Bad Request',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                error: {
                                    type: 'string',
                                    description: 'Error message',
                                    example: 'Email is missing'
                                }
                            }
                        }
                    }
                }
            },
            '404': {
                description: 'Not Found',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                error: {
                                    type: 'string',
                                    description: 'Error message',
                                    example: 'User with this email does not exist'
                                }
                            }
                        }
                    }
                }
            },
            '500': {
                description: 'Internal Server Error',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                error: {
                                    type: 'string',
                                    description: 'Error message',
                                    example: 'Operation was not successful'
                                }
                            }
                        }
                    }
                }
            }
        },
        tags: ['User Management']
    },
    ssoLogin: {
        path: '/v1/sso-login',
        method: 'post',
        summary: 'Login with token',
        description: 'Authenticate user with token',
        parameters: [
            {
                name: 'token',
                in: 'query',
                description: 'Token value',
                schema: {
                    type: 'string'
                },
                required: true
            }
        ],
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            email: {
                                type: 'string',
                                description: 'User email',
                            },
                            password: {
                                type: 'string',
                                description: 'User password',
                            },
                        },
                        required: ['email', 'password'],
                    },
                },
            },
        },
        responses: {
            '200': {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    properties: {
                                        email: {
                                            type: 'string',
                                            description: 'User email',
                                        },
                                        id: {
                                            type: 'string',
                                            description: 'User ID',
                                        },
                                        is_admin: {
                                            type: 'boolean',
                                            description: 'User admin status',
                                        },
                                        first_name: {
                                            type: 'string',
                                            description: 'User first name',
                                        },
                                        last_name: {
                                            type: 'string',
                                            description: 'User last name',
                                        },
                                        token: {
                                            type: 'string',
                                            description: 'Authentication token',
                                        },
                                    },
                                },
                            },
                        },
                        example: {
                            data: {
                                email: 'user@example.com',
                                id: '123456789',
                                is_admin: false,
                                first_name: 'John',
                                last_name: 'Doe',
                                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                            },
                        },
                    },
                },
            },
            // Rest of the responses...
        },
        tags: ['User Management']
    },
    forgotPassword: {
        path: '/v1/forgotPassword',
        method: 'post',
        summary: 'Forgot password',
        description: 'Forgot password',
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            email: {
                                type: 'string',
                                description: 'User email',
                            }
                        },
                        required: ['email'],
                    },
                },
            },
        },
        responses: {
            '200': {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    properties: {
                                        status: {
                                            type: 'string',
                                            description: 'Status fail or success',
                                        },
                                        message: {
                                            type: 'string',
                                            description: 'Message',
                                        },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                email: {
                                                    type: 'string',
                                                    description: 'Users email id',
                                                },
                                                username: {
                                                    type: 'string',
                                                    description: 'Username',
                                                },
                                                token: {
                                                    type: 'string',
                                                    description: 'Unique token',
                                                }
                                            }
                                        }
                                    },
                                },
                            },
                        },
                        example: {
                            data: {
                                status: "success",
                                message: "we've sent password reset instructions to the primary email address on the account",
                                data: {
                                    email: "Bhupi@abc.com",
                                    username: "Bhupi123",
                                    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkJodXBpQGFiYy5jb20iLCJ1c2VyX2lkIjoxMiwiZmlyc3RfbmFtZSI6IkJodXBpIiwibGFzdF9uYW1lIjoiU2lyIiwidXNlcm5hbWUiOiJCaHVwaTEyMyIsImlhdCI6MTY4NzE3NDQ4NCwiZXhwIjoxNjg3NDMzNjg0fQ.dyjULa2_hfo4XFmkDp4x7lTZZRjVX32B1RZwXqxFG4o"
                                }
                            },
                        },
                    },
                },
            },
        },
        tags: ['User Management']
    },
    resetPassword: {
        path: '/v1/resetPassword',
        method: 'post',
        summary: 'Forgot password',
        description: 'Forgot password',
        parameters: [
            {
                name: 'token',
                in: 'query',
                description: 'Token value',
                schema: {
                    type: 'string'
                },
                required: true
            }
        ],
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            email: {
                                type: 'string',
                                description: 'User email',
                            },
                            password: {
                                type: 'string',
                                description: 'User old password',
                            },
                            confirmPassword: {
                                type: 'string',
                                description: 'User new password',
                            }
                        },
                        required: ['email', 'password', 'confirmPassword'],
                    },
                },
            },
        },
        responses: {
            '200': {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    properties: {
                                        status: {
                                            type: 'string',
                                            description: 'Status fail or success',
                                        },
                                        message: {
                                            type: 'string',
                                            description: 'Message',
                                        }
                                    },
                                },
                            },
                        },
                        example: {
                            data: {
                                status: "success",
                                message: "Password reset successfully!",
                            },
                        },
                    },
                },
            },
            '400': {
                description: 'Bad Request',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                error: { type: 'string' }
                            }
                        }
                    }
                }
            },
            '500': {
                description: 'Internal Server Error',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                status: { type: 'string' },
                                error: { type: 'string' }
                            }
                        }
                    }
                }
            }
        },
        tags: ['User Management']
    }
};

module.exports = ssoLoginSchema;
