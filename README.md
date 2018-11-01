# Theater Hub API 

[![GitHub contributors](https://img.shields.io/github/contributors/code4romania/theater-hub-api.svg?style=for-the-badge)]() [![GitHub last commit](https://img.shields.io/github/last-commit/code4romania/theater-hub-api.svg?style=for-the-badge)]() [![License: MPL 2.0](https://img.shields.io/badge/license-MPL%202.0-brightgreen.svg?style=for-the-badge)](https://opensource.org/licenses/MPL-2.0)

* enabling theater through civic tech
* make collaboration as simple as a text message
* encourage people to start national projects
* bring together all the human resources needed
* encourage donors to support independent art

[See the project live](http://theaterhub.ro/)

DIGITAL TOOLS FOR ANALOGUE ARTS - Ironically for the age of communication, the development of the Romanian theatre scene is currently undermined by lack of
resources, collaboration and support within the profession.

The main goal of Theater Hub is to form a community of professionals working in the theater industry. As they interact with each other, they
will start building projects together, thus contributing to the overall enhancement of the arts landscape. 

The users will be able to gather strength and support in order to take on bigger and more impactful projects.

Actors, dancers, technicians, directors, scriptwriters, machinists will all find their place in the hub. They will be the backbone of the app
as one of the core aims is to coagulate them into a community. Theaters, bands, NGOs will also be welcomed.

People willing to contribute to projects they like via donations, or with volunteer or paid services will have their own place on the platform.

This repo holds the API of Theater Hub.

[Built with](#built-with) | [Repos and projects](#repos-and-projects) | [Deployment](#deployment) | [Contributing](#contributing) | [Feedback](#feedback) | [License](#license) | [About Code4Ro](#about-code4ro)

## Built With

### Programming languages

typescript

### Frameworks

express.js

### Platforms

node

### Package managers

npm

### Database technology & provider

postgreSQL, typeorm

## Repos and projects

repo for related client app: https://github.com/code4romania/theater-hub-client

## Deployment

1. Create a PostgreSQL database called: TheaterHub
2. Change the database connection configuration in ormconfig.json to match your own.
3. `npm install`
4. `npm run build`
5. `typeorm migrations:run`
6. `npm run start`

## Contributing

If you would like to contribute to our repository, first identify the scale of what you would like to contribute. If it is small (grammar/spelling or a bug fix) feel free to start working on a fix. If you are submitting a feature or substantial code contribution, please discuss it with the team and ensure it follows the product roadmap. 

* Fork it (https://github.com/code4romania/theater-hub-api/fork)
* Create your feature branch (git checkout -b feature/fooBar)
* Commit your changes (git commit -am 'Add some fooBar')
* Push to the branch (git push origin feature/fooBar)
* Create a new Pull Request

## Feedback

* Request a new feature on GitHub.
* Vote for popular feature requests.
* File a bug in GitHub Issues.
* Email us with other feedback contact@code4.ro

## License

This project is licensed under the MPL 2.0 License - see the [LICENSE](LICENSE) file for details

## About Code4Ro

Started in 2016, Code for Romania is a civic tech NGO, official member of the Code for All network. We have a community of over 500 volunteers (developers, ux/ui, communications, data scientists, graphic designers, devops, it security and more) who work pro-bono for developing digital solutions to solve social problems. #techforsocialgood. If you want to learn more details about our projects [visit our site](https://www.code4.ro/en/) or if you want to talk to one of our staff members, please e-mail us at contact@code4.ro.

Last, but not least, we rely on donations to ensure the infrastructure, logistics and management of our community that is widely spread accross 11 timezones, coding for social change to make Romania and the world a better place. If you want to support us, [you can do it here](https://code4.ro/en/donate/).
