# V2Incentives


## Database Migrations

Follow these steps to create and run database migrations for the project.

### Running Pending Migrations

1. **Start the project:**
   Ensure the project is running.

2. **Run pending migrations:**
   ```bash
   yarn migration:run


### Creating New Migrations

1. **Modify `nest-cli.json`:**
   Open the nest-cli.json file and change the value on line 7 to:
   ```bash
   "webpack": false


2. **Build Project:**
   ```bash
   yarn build
   ```

   This command will generate the `dist` folder containing the database entities.

   
3. **Generate the migration file:**
   ```bash
   yarn migration:generate --name=YourMigrationName
   ```

   This command will create a new migration file in the migrations folder. If the migration name isn't populated, rename the file as needed.


4. **Run the new migration:**
   ```bash
   yarn migration:run
   ```


4. **Revert changes in `nest-cli.json:`**
 Change the `webpack` value back to its original state. Do not commit this change. Only commit the migration files.




